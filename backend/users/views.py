from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


# ================================
# REGISTER VIEW
# POST /api/auth/register/
# ================================
class RegisterView(APIView):

    # Anyone can access this — no login required
    permission_classes = [AllowAny]

    def post(self, request):

        # Step 1 — Pass incoming data to serializer for validation
        serializer = RegisterSerializer(data=request.data)

        # Step 2 — Check if data is valid
        if serializer.is_valid():

            # Step 3 — Save user to database
            user = serializer.save()

            # Step 4 — Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            tokens  = {
                'refresh': str(refresh),
                'access':  str(refresh.access_token),
            }

            # Step 5 — Return success response
            return Response(
                {
                    'message': 'Account created successfully!',
                    'tokens':  tokens,
                    'user':    UserSerializer(user).data
                },
                status=status.HTTP_201_CREATED
            )

        # Step 6 — If data invalid, return errors
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# ================================
# LOGIN VIEW
# POST /api/auth/login/
# ================================
class LoginView(APIView):

    # Anyone can access this — no login required
    permission_classes = [AllowAny]

    def post(self, request):

        # Step 1 — Get email and password from request
        email    = request.data.get('email', '')
        password = request.data.get('password', '')

        # Step 2 — Check if both fields provided
        if not email or not password:
            return Response(
                {'error': 'Please provide email and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 3 — Find user by email
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Step 4 — Verify password using Django's authenticate
        user = authenticate(
            request,
            username=user_obj.username,
            password=password
        )

        # Step 5 — If authentication failed
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Step 6 — Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        tokens  = {
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
        }

        # Step 7 — Return success response
        return Response(
            {
                'message': 'Login successful!',
                'tokens':  tokens,
                'user':    UserSerializer(user).data
            },
            status=status.HTTP_200_OK
        )
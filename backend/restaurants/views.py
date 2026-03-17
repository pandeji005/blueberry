from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Restaurant
from .serializers import RestaurantSerializer

class RestaurantListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        restaurants = Restaurant.objects.all()
        serializer  = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)

class RestaurantDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            restaurant = Restaurant.objects.get(pk=pk)
            serializer = RestaurantSerializer(restaurant)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
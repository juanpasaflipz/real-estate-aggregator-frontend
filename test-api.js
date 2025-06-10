// Test script to verify the API integration
const API_URL = 'https://real-estate-api-7mln.onrender.com';

async function testAPI() {
  console.log('Testing API at:', API_URL);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthRes = await fetch(`${API_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Health check:', healthData);
    
    // Test properties endpoint
    console.log('\n2. Testing properties endpoint...');
    const propertiesRes = await fetch(`${API_URL}/properties?city=Ciudad%20de%20M%C3%A9xico&limit=5`);
    const propertiesData = await propertiesRes.json();
    console.log('Properties response status:', propertiesData.status);
    console.log('Number of properties:', propertiesData.data?.properties?.length || 0);
    
    // Show first property
    if (propertiesData.data?.properties?.[0]) {
      const firstProperty = propertiesData.data.properties[0];
      console.log('\nFirst property sample:');
      console.log('- ID:', firstProperty.id);
      console.log('- Title:', firstProperty.title);
      console.log('- Price:', firstProperty.price);
      console.log('- Images:', firstProperty.images?.length || 0, 'images');
      console.log('- Bathrooms:', firstProperty.bathrooms);
      console.log('- Size:', firstProperty.size);
      console.log('- Property Type:', firstProperty.propertyType);
      console.log('- Features:', firstProperty.features);
      console.log('- URL:', firstProperty.link);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    console.error('Make sure the backend is running on port 3002');
  }
}

testAPI();
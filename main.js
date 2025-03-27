const axios = require('axios');
const fetchShopeeData = async () => {
  const url = 'https://api-ecom.duthanhduoc.com/products';

  const response = await axios.get(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      Cookie: 'SPC_EC=your_cookie_here',
    },
  });

  const product = response.data;
};

fetchShopeeData();

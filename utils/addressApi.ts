interface AddressData {
  prefecture: string;
  city1: string;
  city2: string;
  streetAddress: string;
}

export const fetchAddressByPostalCode = async (postalCode: string): Promise<AddressData | null> => {
  try {
    // Remove any non-numeric characters from postal code
    const cleanPostalCode = postalCode.replace(/\D/g, '');
    
    // Accept both 6 and 7 digit postal codes
    if (cleanPostalCode.length < 6 || cleanPostalCode.length > 7) {
      throw new Error('郵便番号は6桁または7桁で入力してください');
    }

    // Use Japan's postal code API
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanPostalCode}`);
    const data = await response.json();

    if (data.status !== 200 || !data.results || data.results.length === 0) {
      throw new Error('郵便番号が見つかりませんでした');
    }

    const result = data.results[0];
    
    return {
      prefecture: result.address1 || '', // 都道府県
      city1: result.address2 || '',      // 市区町村1
      city2: result.address3 || '',      // 市区町村2
      streetAddress: '',                 // 番地・建物名はAPIから取得できないため空文字
    };
  } catch (error) {
    console.error('Address fetch error:', error);
    throw error;
  }
};

// Alternative API endpoint (backup)
export const fetchAddressByPostalCodeAlternative = async (postalCode: string): Promise<AddressData | null> => {
  try {
    const cleanPostalCode = postalCode.replace(/\D/g, '');
    
    // Accept both 6 and 7 digit postal codes
    if (cleanPostalCode.length < 6 || cleanPostalCode.length > 7) {
      throw new Error('郵便番号は6桁または7桁で入力してください');
    }

    // Alternative API endpoint
    const response = await fetch(`https://api.zipaddress.net/?zipcode=${cleanPostalCode}`);
    const data = await response.json();

    if (data.code !== 200) {
      throw new Error(data.message || '郵便番号が見つかりませんでした');
    }

    return {
      prefecture: data.data.pref || '',
      city1: data.data.address || '',
      city2: '',
      streetAddress: '',
    };
  } catch (error) {
    console.error('Alternative address fetch error:', error);
    throw error;
  }
}; 
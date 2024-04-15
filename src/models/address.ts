export interface AddressInfo {
    id: string;
    isDefaultBillingAddress: boolean;
    isDefaultShippingAddress: boolean;
    country: {
      code: string; 
      country: string;
    };
    countryArea: string;
    city: string;
    cityArea: string;
    streetAddress1: string;
    streetAddress2: string;
    postalCode: string;
    companyName: string;
    firstName: string;
    lastName: string;
    phone: string;
}
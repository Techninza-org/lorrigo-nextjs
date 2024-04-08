import { useEffect, useState } from 'react';
import { useSellerProvider } from "@/components/providers/SellerProvider";
import { AxiosError } from 'axios';

const useFetchCityState = (pincode: string) => {
    const { getCityStateFPincode } = useSellerProvider();

    const [cityState, setCityState] = useState({
        city: "",
        state: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryAttempts, setRetryAttempts] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        const fetchCityState = async () => {
            setLoading(true);
            try {
                const response = await getCityStateFPincode(pincode);
                setCityState({ city: response.city, state: response.state });
                
                setError(null);
                setRetryAttempts(0);
            } catch (error: AxiosError | any) {
                setError(error.message);
            
                setRetryAttempts(retryAttempts + 1);
                
            } finally {
                setLoading(false);
            }
        };

    
        const debounceFetchCityState = (input: string) => {
            clearTimeout(timer!);
            timer = setTimeout(() => {
            
                if (retryAttempts < 3) {
                    fetchCityState(); 
                }
            }, 900);
        };

        if (pincode) {
            debounceFetchCityState(pincode);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [pincode, retryAttempts]);

    return { cityState, loading, error };
};

export default useFetchCityState;

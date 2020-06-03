import {useRouter} from '@akeneo-pim-community/legacy-bridge';
import {useAttributeContext} from '../contexts';

const useCreateAttributeOption = () => {
    const router = useRouter();
    const attribute = useAttributeContext();

    return async (attributeOptionCode: string) => {
        const response = await fetch(
            router.generate('pim_enrich_attributeoption_create', {
                attributeId: attribute.attributeId,
            }),
            {
                method: 'POST',
                headers: [
                    ['Content-type', 'application/json'],
                    ['X-Requested-With', 'XMLHttpRequest'],
                ],
                body: JSON.stringify({
                    code: attributeOptionCode,
                }),
            }
        );

        return await response.json();
    };
};

export {useCreateAttributeOption};

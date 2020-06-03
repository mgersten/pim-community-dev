import React from 'react';
import {useTranslate} from '@akeneo-pim-community/legacy-bridge';

const NewOptionPlaceholder = () => {
    const translate = useTranslate();

    return (
        <div className="AknAttributeOption-listItem AknAttributeOption-listItem--selected">
            <span className="AknAttributeOption-itemCode">
                {translate('pim_enrich.entity.attribute_option.module.edit.new_option_code')}
            </span>
        </div>
    );
};

export default NewOptionPlaceholder;

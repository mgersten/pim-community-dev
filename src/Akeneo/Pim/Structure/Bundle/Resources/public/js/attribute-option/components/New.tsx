import React, {useRef} from 'react';
import {useTranslate} from '@akeneo-pim-community/legacy-bridge';

interface NewProps {
    onCreate: (optionCode: string) => void;
}

const New = ({onCreate}: NewProps) => {
    const translate = useTranslate();
    const newOptionCodeRef = useRef(null);

    const createNewOptionFromCode = () => {
        // @ts-ignore
        if (newOptionCodeRef.current !== null && newOptionCodeRef.current.value) {
            // @ts-ignore
            onCreate(newOptionCodeRef.current.value.trim());
        }
    };

    return (
        <div className="AknSubsection AknAttributeOption-edit">
            <div className="AknSubsection-title AknSubsection-title--glued tabsection-title">
                <span>{translate('pim_enrich.entity.attribute_option.module.edit.options_labels')}</span>
            </div>
            <div>
                <div className="AknFieldContainer">
                    <div className="AknFieldContainer-header">
                        <label className="AknFieldContainer-label control-label AknFieldContainer-label">
                            <span>{translate('pim_enrich.entity.attribute_option.module.edit.option_code')}</span>
                        </label>
                    </div>
                    <div className="AknFieldContainer-inputContainer field-input">
                        <input
                            type="text"
                            className="AknTextField"
                            role="attribute-option-label"
                            ref={newOptionCodeRef}
                        />
                    </div>
                </div>
                <button className="AknButton AknButton--apply save" role="create-option-button" onClick={() => createNewOptionFromCode()}>
                    {translate('pim_common.done')}
                </button>
            </div>
        </div>
    );
};

export default New;

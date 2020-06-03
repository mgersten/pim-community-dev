import React, {useEffect, useState} from 'react';
import useAttributeOptions from '../hooks/useAttributeOptions';
import {AttributeOption} from '../model';
import ToggleButton from './ToggleButton';
import ListItem from './ListItem';
import {useTranslate} from '@akeneo-pim-community/legacy-bridge';
import NewOptionPlaceholder from './NewOptionPlaceholder';

interface ListProps {
    onSelectAttributeOption: (selectedOptionId: number | null) => void;
    onShowNewOptionForm: (isDisplayed: boolean) => void;
    selectedOptionId: number | null;
}

const List = ({onSelectAttributeOption, selectedOptionId, onShowNewOptionForm}: ListProps) => {
    const attributeOptions = useAttributeOptions();
    const translate = useTranslate();
    const [showNewOptionPlaceholder, setShowNewOptionPlaceholder] = useState<boolean>(false);

    useEffect(() => {
        if (selectedOptionId !== null) {
            setShowNewOptionPlaceholder(false);
        }
    }, [selectedOptionId]);

    const onSelectItem = (optionId: number) => {
        setShowNewOptionPlaceholder(false);
        onSelectAttributeOption(optionId);
        onShowNewOptionForm(false);
    };

    const displayNewOptionPlaceholder = () => {
        setShowNewOptionPlaceholder(true);
        onSelectAttributeOption(null);
        onShowNewOptionForm(true);
    };

    return (
        <div className="AknSubsection AknAttributeOption-list">
            <div className="AknSubsection-title AknSubsection-title--glued tabsection-title">
                <span>{translate('pim_enrich.entity.attribute_option.module.edit.options_codes')}</span>
                <div className="AknButton AknButton--micro" onClick={() => displayNewOptionPlaceholder()}>
                    {translate('pim_enrich.entity.product.module.attribute.add_option')}
                </div>
            </div>

            <div>{translate('pim_enrich.entity.attribute.property.auto_option_sorting')}</div>
            <ToggleButton />

            <div role="attribute-options-list">
                {attributeOptions !== null && attributeOptions.map((attributeOption: AttributeOption) => {
                    return (
                        <ListItem
                            key={attributeOption.code}
                            data={attributeOption}
                            onSelectAttributeOption={onSelectItem}
                            isSelected={selectedOptionId === attributeOption.id}
                        />
                    );
                })}
                {showNewOptionPlaceholder === true && (<NewOptionPlaceholder/>)}
            </div>
        </div>
    );
};

export default List;

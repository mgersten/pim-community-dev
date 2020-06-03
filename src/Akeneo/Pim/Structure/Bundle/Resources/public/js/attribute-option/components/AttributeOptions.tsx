import React, {useEffect, useState} from 'react';
import List from './List';
import Edit from './Edit';
import New from './New';
import {useDispatch, useSelector} from 'react-redux';
import {AttributeOptionsState} from '../store/store';
import {AttributeOption} from '../model';
import {useSaveAttributeOption} from '../hooks/useSaveAttributeOption';
import {useCreateAttributeOption} from '../hooks/useCreateAttributeOption';
import {updateAttributeOptionAction, createAttributeOptionAction} from '../reducers';

const AttributeOptions = () => {
    const attributeOptions = useSelector((state: AttributeOptionsState) => state.attributeOptions);
    const [selectedOption, setSelectedOption] = useState<AttributeOption | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showNewOptionForm, setShowNewOptionForm] = useState<boolean>(false);
    const attributeOptionSaver = useSaveAttributeOption();
    const attributeOptionCreate = useCreateAttributeOption();
    const dispatchAction = useDispatch();

    useEffect(() => {
        if (attributeOptions !== null && attributeOptions.length > 0) {
            setSelectedOption(attributeOptions[0]);
        } else {
            setSelectedOption(null);
        }
    }, [attributeOptions]);

    const onSelectAttributeOption = (optionId: number | null) => {
        if (attributeOptions !== null) {
            const option = attributeOptions.find((option: AttributeOption) => option.id === optionId);
            if (option !== undefined) {
                setSelectedOption(option);
                setShowNewOptionForm(false);

                return;
            }
        }

        setShowNewOptionForm(false);
        setSelectedOption(null);
    };

    const onSaveAttributeOption = async (attributeOption: AttributeOption) => {
        setIsSaving(true);
        await attributeOptionSaver(attributeOption);
        setIsSaving(false);
        dispatchAction(updateAttributeOptionAction(attributeOption));
    };

    const onShowNewOptionForm = (isDisplayed: boolean) => {
        setShowNewOptionForm(isDisplayed);
    };

    const onCreateNewOption = async (optionCode: string) => {
        setIsSaving(true);
        const attributeOption = await attributeOptionCreate(optionCode);
        setIsSaving(false);
        dispatchAction(createAttributeOptionAction(attributeOption));
        setShowNewOptionForm(false);
    };

    return (
        <div className="AknAttributeOption">
            {(attributeOptions === null || isSaving) && <div className="AknLoadingMask"/>}

            <List
                onSelectAttributeOption={onSelectAttributeOption}
                selectedOptionId={selectedOption ? selectedOption.id : null}
                onShowNewOptionForm={onShowNewOptionForm}
            />

            {(selectedOption !== null && <Edit option={selectedOption} onSave={onSaveAttributeOption}/>)}

            {(selectedOption === null && showNewOptionForm && <New onCreate={onCreateNewOption}/>)}
        </div>
    );
};

export default AttributeOptions;

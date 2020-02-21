import {act, waitForElement} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import React from 'react';
import {Route, Router} from 'react-router-dom';
import {ConnectionsProvider} from '@src/settings/connections-context';
import {EditConnection} from '@src/settings/pages/EditConnection';
import {renderWithProviders} from '../../../test-utils';
import {WrongCredentialsCombinationsProvider} from '@src/settings/wrong-credentials-combinations-context';
import {UserContext} from '@src/shared/user';
import {DashboardProvider} from '@src/audit/dashboard-context';
import {Dashboard} from '@src/audit/pages/Dashboard';

jest.mock('@src/common/components/Select2');

describe('testing EditConnection page', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('creates a connection', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({
                ecommerce: {
                    code: 'ecommerce',
                    users: [
                        {
                            username: 'nope',
                            date: '2020-01-02T12:34:23+00:00',
                        },
                    ],
                },
            })
        );
        fetchMock.mockResponseOnce(
            JSON.stringify({
                code: 'ecommerce',
                label: 'Franklin',
                flow_type: 'data_source',
                image: null,
                client_id: '<client_id>',
                secret: '<secret>',
                username: 'franklin_<tag>',
                password: null,
                user_role_id: '1',
                user_group_id: '3',
            })
        );
        fetchMock.mockResponseOnce(
            JSON.stringify([
                {id: 1, role: 'ROLE_USER', label: 'User'},
                {id: 2, role: 'ROLE_API', label: 'API Role'},
            ])
        );
        fetchMock.mockResponseOnce(
            JSON.stringify([
                {name: 'All', meta: {id: 3, default: false}},
                {name: 'API Group', meta: {id: 4, default: false}},
            ])
        );
        fetchMock.mockResponseOnce(JSON.stringify({}));

        const history = createMemoryHistory({initialEntries: ['/connections/ecommerce/edit']});
        const userContext = {
            get: (key: string) => {
                if ('uiLocale' === key) {
                    return 'en_US';
                }
                if ('timezone' === key) {
                    return 'UTC';
                }

                return key;
            },
            set: () => undefined,
        };
        const {getByText, getByLabelText} = renderWithProviders(
            <Router history={history}>
                <Route path='/connections/:code/edit'>
                    <UserContext.Provider value={userContext}>
                        <WrongCredentialsCombinationsProvider>
                            <ConnectionsProvider>
                                <EditConnection />
                            </ConnectionsProvider>
                        </WrongCredentialsCombinationsProvider>
                    </UserContext.Provider>
                </Route>
            </Router>
        );

        expect(fetchMock).toBeCalledTimes(2);
        expect(fetchMock.mock.calls[0][0]).toEqual(
            'akeneo_connectivity_connection_rest_wrong_credentials_combination_list'
        );
        expect(fetchMock.mock.calls[1][0]).toEqual('akeneo_connectivity_connection_rest_get?code=ecommerce');

        await waitForElement(() => getByText('Franklin'));
        expect(fetchMock).toBeCalledTimes(4);
        expect(fetchMock.mock.calls[2][0]).toEqual('pim_user_user_role_rest_index');
        expect(fetchMock.mock.calls[3][0]).toEqual('pim_user_user_group_rest_index');

        const labelInput = getByLabelText(/^akeneo_connectivity\.connection\.connection\.label/) as HTMLInputElement;
        const flowTypeSelect = getByText('akeneo_connectivity.connection.flow_type.data_source')
            .parentElement as HTMLSelectElement;
        const userRoleSelect = getByText('User').parentElement as HTMLSelectElement;
        const userGroupSelect = getByText('All').parentElement as HTMLSelectElement;
        const saveButton = getByText('pim_common.save') as HTMLButtonElement;

        await act(async () => {
            await userEvent.type(labelInput, 'Magento');
            userEvent.selectOptions(flowTypeSelect, 'data_destination');
            userEvent.selectOptions(userRoleSelect, '2');
            userEvent.selectOptions(userGroupSelect, '4');
            userEvent.click(saveButton);
        });

        expect(fetchMock).toBeCalledTimes(5);
        expect(fetchMock.mock.calls[4][0]).toEqual('akeneo_connectivity_connection_rest_update?code=ecommerce');
        expect(fetchMock.mock.calls[4][1]).toMatchObject({
            method: 'POST',
            body: JSON.stringify({
                code: 'ecommerce',
                label: 'Magento',
                flow_type: 'data_destination',
                image: null,
                user_role_id: '2',
                user_group_id: '4',
            }),
        });
    });
});

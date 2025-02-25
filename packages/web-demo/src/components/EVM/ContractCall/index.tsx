import React, { useState } from 'react';
import { Button, message, Input, notification } from 'antd';
import { isValidEVMAddress } from '../../../utils';

function ContractCall(props: any) {
    const [loading, setLoading] = useState<number>(0);

    const [contractAddress, setContractAddress] = useState<string>();
    const [contractMethod, setContractMethod] = useState<string>();
    const [methodParams, setMethodParams] = useState<string>();
    const [contractABI, setContractABI] = useState<string>();

    const callContract = async () => {
        if (!contractAddress || !contractMethod || !methodParams || !contractABI) {
            message.warning('Please input contract address, contract method, method params and contract ABI');
            return;
        }

        // setLoading(1);

        const accounts = await window.web3.eth.getAccounts();
        window.web3.eth.Contract.setProvider(window.web3.currentProvider, accounts);

        const params = methodParams.split(',');

        var contract = new window.web3.eth.Contract(JSON.parse(contractABI), contractAddress);

        if (!isValidEVMAddress(contractAddress)) {
            setLoading(0);
            return notification.error({
                message: 'Please enter the correct address',
            });
        }
        const methodCall = contract.methods[contractMethod];
        //@ts-ignore
        methodCall.call(this, ...params).send(
            {
                from: accounts[0],
                gas: 23000,
            },
            (error: any, hash: any) => {
                if (error) {
                    if (error.code !== 4011) {
                        message.error(error.message);
                    }
                } else {
                    notification.success({
                        message: 'Contract Call Success',
                        description: hash,
                    });
                }
                setLoading(0);
            }
        );
    };

    return (
        <div className="form-item card">
            <h3>Contract Call</h3>
            <div className="form-input">
                <label>
                    <p>Contract address</p>
                    <Input
                        placeholder="please input contract address"
                        readOnly={!!loading}
                        onChange={(e: any) => setContractAddress(e.target?.value?.trim())}
                    ></Input>
                </label>
                <label>
                    <p>Contract method</p>
                    <Input
                        placeholder="please input contract method"
                        readOnly={!!loading}
                        onChange={(e: any) => setContractMethod(e.target?.value?.trim())}
                    ></Input>
                </label>
                <label>
                    <p>Method params (split with ",")</p>
                    <Input
                        placeholder="please input method params"
                        readOnly={!!loading}
                        onChange={(e: any) => setMethodParams(e.target?.value?.trim())}
                    ></Input>
                </label>
                <label>
                    <p>Contract ABI</p>
                    <Input
                        placeholder="please input contract ABI"
                        readOnly={!!loading}
                        onChange={(e: any) => setContractABI(e.target?.value?.trim())}
                    ></Input>
                </label>
            </div>

            <div className="form-submit">
                <Button type="primary" loading={loading === 1} onClick={callContract} disabled={!props.loginState}>
                    SEND
                </Button>
            </div>
        </div>
    );
}

export default ContractCall;

import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { useTranslation } from 'react-i18next';

import { useTypedParams } from 'Modules/Guilds/Hooks/useTypedParams';
import { RichContractData } from 'hooks/Guilds/contracts/useRichContractRegistry';
import {
  defaultValues,
  getEditor,
  supportedActions,
} from 'Components/ActionsBuilder/SupportedActions';
import {
  DecodedAction,
  DecodedCall,
  SupportedAction,
} from 'Components/ActionsBuilder/types';
import { Modal } from 'old-components/Guilds/common/Modal';
import {
  ContractActionsList,
  ApproveSpendTokens,
  ContractsList,
  ParamsForm,
} from './components';
import { EditorWrapper, BlockButton } from './ActionsModal.styled';
import { ActionModalProps } from './types';

const ActionModal: React.FC<ActionModalProps> = ({
  action,
  isOpen,
  setIsOpen,
  onAddAction,
}) => {
  const { t } = useTranslation();
  const { guildId } = useTypedParams();
  const { account: walletAddress } = useWeb3React();
  // Supported Actions
  const [selectedAction, setSelectedAction] =
    React.useState<SupportedAction>(null);
  const [selectedActionContract, setSelectedActionContract] =
    React.useState<utils.Interface>(null);

  // Generic calls
  const [selectedContract, setSelectedContract] =
    React.useState<RichContractData>(null);
  const [selectedFunction, setSelectedFunction] = React.useState<string>(null);

  const [data, setData] = React.useState<DecodedCall>(null);
  const [showTokenApprovalForm, setShowTokenApprovalForm] =
    React.useState(false);
  const [payableFnData, setPayableFnData] = React.useState<any>(null);

  useEffect(() => {
    if (!action?.decodedCall) return;

    if (action.decodedCall.callType === SupportedAction.GENERIC_CALL) {
      setSelectedContract(action.decodedCall.richData);
      setSelectedFunction(action.decodedCall.function.name);
    } else {
      setSelectedAction(action.decodedCall.callType);
    }

    setData(action.decodedCall);
    setPayableFnData(action.approval);
    setShowTokenApprovalForm(action.approval ? true : false);
  }, [action]);

  function getHeader() {
    if (selectedFunction) {
      return selectedContract.functions.find(
        fn => fn.functionName === selectedFunction
      )?.title;
    }

    if (selectedContract) {
      return selectedContract?.title;
    }

    if (selectedAction) {
      return supportedActions[selectedAction].title;
    }

    return t('addAction');
  }

  function getContent() {
    if (selectedFunction) {
      const contractInterface = selectedContract.contractInterface;
      const contractId = selectedContract.contractAddress;
      const fn = selectedContract.functions.find(
        fn => fn.functionName === selectedFunction
      );
      const isPayable: boolean = fn?.spendsTokens;
      // Return approval form if function is marked with spendsTokens=true
      if (showTokenApprovalForm || (isPayable && !payableFnData)) {
        return <ApproveSpendTokens onConfirm={setPayableFnData} />;
      }

      return (
        <ParamsForm
          fn={fn}
          defaultValues={data?.args}
          onSubmit={args => {
            onAddAction({
              id: `action-${Math.random()}`,
              contract: contractInterface,
              decodedCall: {
                callType: SupportedAction.GENERIC_CALL,
                from: guildId,
                to: contractId,
                function: contractInterface.getFunction(selectedFunction),
                value: BigNumber.from(0),
                args,
                richData: selectedContract,
              },
              approval: payableFnData,
            });
            handleClose();
          }}
        />
      );
    }

    if (selectedContract) {
      return (
        <ContractActionsList
          contract={selectedContract}
          onSelect={setSelectedFunction}
        />
      );
    }

    if (selectedAction) {
      const Editor = getEditor(selectedAction);
      return (
        <EditorWrapper data-testid="actions-modal-editor">
          <Editor decodedCall={data} updateCall={setData} />
          <BlockButton onClick={saveSupportedAction}>
            {t('saveAction')}
          </BlockButton>
        </EditorWrapper>
      );
    }

    return (
      <ContractsList
        onSelect={setSelectedContract}
        onSupportedActionSelect={setSupportedAction}
      />
    );
  }

  function goBack() {
    if (selectedFunction) {
      setSelectedFunction(null);
      setPayableFnData(null);
    } else if (selectedContract) {
      setSelectedContract(null);
    } else if (selectedAction) {
      setSelectedAction(null);
      setSelectedActionContract(null);
    }

    setData(null);
  }

  function setSupportedAction(action: SupportedAction) {
    const defaultDecodedAction = defaultValues[action] as DecodedAction;
    if (!defaultDecodedAction) return null;

    defaultDecodedAction.decodedCall.from = guildId;
    defaultDecodedAction.decodedCall.callType = action;
    switch (action) {
      case SupportedAction.REP_MINT:
        defaultDecodedAction.decodedCall.args.to = walletAddress;
        break;
    }
    setData(defaultDecodedAction.decodedCall);
    setSelectedAction(action);
    setSelectedActionContract(defaultDecodedAction.contract);
  }

  function saveSupportedAction() {
    if (!selectedAction || !data || !setSelectedActionContract) return;

    const decodedAction: DecodedAction = {
      id: `action-${Math.random()}`,
      decodedCall: data,
      contract: selectedActionContract,
    };

    onAddAction(decodedAction);
    handleClose();
  }

  const handleClose = () => {
    setSelectedFunction(null);
    setSelectedContract(null);
    setSelectedAction(null);
    setSelectedActionContract(null);
    setPayableFnData(null);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleClose}
      header={getHeader()}
      maxWidth={300}
      backnCross={!action && (!!selectedAction || !!selectedContract)}
      prevContent={goBack}
    >
      {getContent()}
    </Modal>
  );
};

export default ActionModal;

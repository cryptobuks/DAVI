import { renderHook } from '@testing-library/react-hooks';
import { BigNumber } from 'ethers';
import { ContractState } from 'types/types.guilds.d';
import useExecutable from '.';
import * as hooks from 'Modules/Guilds/Hooks/useProposal';

jest.mock('moment', () => {
  return () =>
    jest.requireActual('moment')('01.01.2022 10:10', 'DD.MM.YYYY HH:mm');
});

let mockedData = {
  id: '0x0',
  creator: '0x0',
  startTime: jest.requireActual('moment')(
    '01.01.2022 10:10',
    'DD.MM.YYYY HH:mm'
  ),
  endTime: jest.requireActual('moment')('01.01.2022 11:10', 'DD.MM.YYYY HH:mm'),
  timeDetail: '',
  to: ['0x0', '0x0'],
  data: ['0x0', '0x0'],
  value: [BigNumber.from(0), BigNumber.from(0)],
  totalActions: BigNumber.from(0),
  title: 'Proposal Title',
  contentHash: '0x0',
  contractState: ContractState.Active,
  totalVotes: [BigNumber.from(0)],
};

jest.mock('react-router-dom', () => ({
  _esModule: true,
  useMatch: () => ({ url: '/guild_id/proposal_id/' }),
}));

jest.mock('Modules/Guilds/Hooks/useTypedParams', () => ({
  useTypedParams: () => ({
    chainName: 'localhost',
    guildId: '0xE9bDaB08f2FBb370d2a6F6661a92d9B6157E9fd2',
  }),
}));

jest.mock('contexts/Guilds/transactions', () => ({
  useTransactions: () => ({
    transactions: {
      hash: '0x0',
      from: '0x0',
      addedTime: 0,
    },
    pendingTransaction: {
      summary: 'filler transaction',
      transactionHash: '0x0',
      cancelled: false,
      showModal: true,
    },
    createTransaction: jest.fn(() => true),
    clearAllTransactions: jest.fn(),
  }),
}));

jest.mock('hooks/Guilds/contracts/useContract', () => ({
  useERC20Guild: () => ({
    contractId: '0x0',
    abi: 'anything',
    provider: jest.fn(),
    account: '0x0',
    chainId: 0,
    walletChainId: 0,
    withSignerIfPossible: false,
  }),
}));

describe('useExecutable', () => {
  it(`executeProposal function is valid if there is proposal data`, async () => {
    jest.spyOn(hooks, 'default').mockImplementation(
      () =>
        ({
          data: mockedData,
        } as ReturnType<typeof hooks.default>)
    );
    const { result } = renderHook(() => useExecutable());
    expect(result.current.loading).toBeFalsy();
    expect(result.current.data.executeProposal).toBeTruthy();
  });

  it(`executeProposal function is null if there isn't proposal data`, async () => {
    jest.spyOn(hooks, 'default').mockImplementation(
      () =>
        ({
          data: null,
        } as ReturnType<typeof hooks.default>)
    );
    const { result } = renderHook(() => useExecutable());
    expect(result.current.loading).toBeTruthy();
    expect(result.current.data.executeProposal).toBeNull();
  });
});

import useGuildImplementationTypeConfig from 'Modules/Guilds/Hooks/useGuildImplementationType';
import SnapshotERC20Guild from 'contracts/SnapshotERC20Guild.json';
import { useContractRead } from 'wagmi';

interface useSnapshotIdProps {
  contractAddress: string;
  proposalId: string;
}

const useSnapshotId = ({ contractAddress, proposalId }: useSnapshotIdProps) => {
  const { isSnapshotGuild } = useGuildImplementationTypeConfig(contractAddress);
  return useContractRead({
    enabled: isSnapshotGuild,
    addressOrName: contractAddress,
    contractInterface: SnapshotERC20Guild.abi,
    functionName: 'getProposalSnapshotId',
    args: [proposalId],
  });
};

export default useSnapshotId;

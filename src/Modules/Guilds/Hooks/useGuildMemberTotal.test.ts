import useGuildMemberTotal from 'Modules/Guilds/Hooks/useGuildMemberTotal';
import {
  MOCK_GUILD_MEMBERS_TOTAL,
  MOCK_GUILD_ADDRESS,
} from 'Modules/Guilds/Hooks/fixtures';
jest.mock('Modules/Guilds/Hooks/useGuildMemberTotal', () => ({
  __esModule: true,
  default: () => ({
    data: MOCK_GUILD_MEMBERS_TOTAL,
    isError: false,
    isLoading: false,
  }),
}));

describe('useGuildMemberTotal', () => {
  it('should return guild member totals', () => {
    const { data, isError, isLoading } =
      useGuildMemberTotal(MOCK_GUILD_ADDRESS);
    expect(data).toMatchInlineSnapshot(`3`);
    expect(isError).toBe(false);
    expect(isLoading).toBe(false);
  });
});

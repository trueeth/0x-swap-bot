interface Token {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
    logoURI: string;
}


export const TOKENS: Record<string, Token> = {
    wsteth: {
        name: 'Wrapped liquid staked Ether 2.0',
        address: '0x5979D7b546E38E414F7E9822514be443A4800529',
        symbol: 'wstETH',
        decimals: 18,
        chainId: 42161,
        logoURI: ''
    }, 
    usdt: {
        name: 'Tether USD',
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        symbol: 'USDT',
        decimals: 6,
        chainId: 42161,
        logoURI: ''
    }
}
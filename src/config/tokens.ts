interface Token {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
    logoURI: string;
}


export const TOKENS: Record<string, Token> = {
    weth: {
        name: 'Wrapped Ether',
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        symbol: 'WETH',
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
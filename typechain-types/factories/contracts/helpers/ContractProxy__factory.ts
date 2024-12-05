/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BytesLike,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { PayableOverrides } from "../../../common";
import type {
  ContractProxy,
  ContractProxyInterface,
} from "../../../contracts/helpers/ContractProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
] as const;

const _bytecode =
  "0x60806040526040516106e53803806106e583398181016040528101906100259190610512565b610035828261003c60201b60201c565b50506105f6565b61004b826100c160201b60201c565b8173ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a26000815111156100ae576100a8828261019460201b60201c565b506100bd565b6100bc61021e60201b60201c565b5b5050565b60008173ffffffffffffffffffffffffffffffffffffffff163b0361011d57806040517f4c9c8ce3000000000000000000000000000000000000000000000000000000008152600401610114919061057d565b60405180910390fd5b806101507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b61025b60201b60201c565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60606000808473ffffffffffffffffffffffffffffffffffffffff16846040516101be91906105df565b600060405180830381855af49150503d80600081146101f9576040519150601f19603f3d011682016040523d82523d6000602084013e6101fe565b606091505b509150915061021485838361026560201b60201c565b9250505092915050565b6000341115610259576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b6000819050919050565b6060826102805761027b826102fa60201b60201c565b6102f2565b600082511480156102a8575060008473ffffffffffffffffffffffffffffffffffffffff163b145b156102ea57836040517f9996b3150000000000000000000000000000000000000000000000000000000081526004016102e1919061057d565b60405180910390fd5b8190506102f3565b5b9392505050565b60008151111561030d5780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061037e82610353565b9050919050565b61038e81610373565b811461039957600080fd5b50565b6000815190506103ab81610385565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610404826103bb565b810181811067ffffffffffffffff82111715610423576104226103cc565b5b80604052505050565b600061043661033f565b905061044282826103fb565b919050565b600067ffffffffffffffff821115610462576104616103cc565b5b61046b826103bb565b9050602081019050919050565b60005b8381101561049657808201518184015260208101905061047b565b60008484015250505050565b60006104b56104b084610447565b61042c565b9050828152602081018484840111156104d1576104d06103b6565b5b6104dc848285610478565b509392505050565b600082601f8301126104f9576104f86103b1565b5b81516105098482602086016104a2565b91505092915050565b6000806040838503121561052957610528610349565b5b60006105378582860161039c565b925050602083015167ffffffffffffffff8111156105585761055761034e565b5b610564858286016104e4565b9150509250929050565b61057781610373565b82525050565b6000602082019050610592600083018461056e565b92915050565b600081519050919050565b600081905092915050565b60006105b982610598565b6105c381856105a3565b93506105d3818560208601610478565b80840191505092915050565b60006105eb82846105ae565b915081905092915050565b60e1806106046000396000f3fe6080604052600a600c565b005b60186014601a565b6027565b565b60006022604c565b905090565b3660008037600080366000845af43d6000803e80600081146047573d6000f35b3d6000fd5b600060787f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b60a1565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600081905091905056fea2646970667358221220b65124cccf6cb5a48bbd1da086f87f82e3e95bea001f9c5335805aadcd20573f64736f6c63430008140033";

type ContractProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ContractProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ContractProxy__factory extends ContractFactory {
  constructor(...args: ContractProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    implementation: AddressLike,
    _data: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(implementation, _data, overrides || {});
  }
  override deploy(
    implementation: AddressLike,
    _data: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ) {
    return super.deploy(implementation, _data, overrides || {}) as Promise<
      ContractProxy & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ContractProxy__factory {
    return super.connect(runner) as ContractProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ContractProxyInterface {
    return new Interface(_abi) as ContractProxyInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ContractProxy {
    return new Contract(address, _abi, runner) as unknown as ContractProxy;
  }
}

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
  BigNumberish,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  XAllocationVotingGovernorMock,
  XAllocationVotingGovernorMockInterface,
} from "../../../contracts/mocks/XAllocationVotingGovernorMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingPeriodInBlocks",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "B3TRGovernorOnlyExecutor",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "GovernorAlreadyCastVote",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "appId",
        type: "bytes32",
      },
    ],
    name: "GovernorAppNotAvailableForVoting",
    type: "error",
  },
  {
    inputs: [],
    name: "GovernorInsufficientVotingPower",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingPeriod",
        type: "uint256",
      },
    ],
    name: "GovernorInvalidVotingPeriod",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "GovernorNonexistentRound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "person",
        type: "address",
      },
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "GovernorPersonhoodVerificationFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        internalType: "enum IXAllocationVotingGovernor.RoundState",
        name: "current",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "expectedStates",
        type: "bytes32",
      },
    ],
    name: "GovernorUnexpectedRoundState",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "threshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "votes",
        type: "uint256",
      },
    ],
    name: "GovernorVotingThresholdNotMet",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "person",
        type: "address",
      },
    ],
    name: "XAllocationVotingPersonhoodVerificationFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "appsIds",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "voteWeights",
        type: "uint256[]",
      },
    ],
    name: "AllocationVoteCast",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "proposer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteStart",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteEnd",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "appsIds",
        type: "bytes32[]",
      },
    ],
    name: "RoundCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "CLOCK_MODE",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "COUNTING_MODE",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "appsIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "voteWeights",
        type: "uint256[]",
      },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "clock",
    outputs: [
      {
        internalType: "uint48",
        name: "",
        type: "uint48",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentRoundDeadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentRoundId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentRoundSnapshot",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "getAppIdsOfRound",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "appId",
        type: "bytes32",
      },
    ],
    name: "getAppVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "app",
        type: "bytes32",
      },
    ],
    name: "getAppVotesQF",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "getRoundAppSharesCap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "getRoundBaseAllocationPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timepoint",
        type: "uint256",
      },
    ],
    name: "getVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "hasVotedOnce",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "isActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "appId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "isEligibleForVote",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "latestSucceededRoundId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timepoint",
        type: "uint256",
      },
    ],
    name: "quorum",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "quorumReached",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "roundDeadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "roundProposer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "roundQuorum",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "roundSnapshot",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "votingPeriodInBlocks",
        type: "uint256",
      },
    ],
    name: "setVotingPeriodInBlocks",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startNewRound",
    outputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "state",
    outputs: [
      {
        internalType: "enum IXAllocationVotingGovernor.RoundState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "totalVoters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "totalVotes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "roundId",
        type: "uint256",
      },
    ],
    name: "totalVotesQF",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620016f1380380620016f18339818101604052810190620000379190620000d2565b600081116200007d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000074906200018b565b60405180910390fd5b806001819055506000808190555050620001ad565b600080fd5b6000819050919050565b620000ac8162000097565b8114620000b857600080fd5b50565b600081519050620000cc81620000a1565b92915050565b600060208284031215620000eb57620000ea62000092565b5b6000620000fb84828501620000bb565b91505092915050565b600082825260208201905092915050565b7f566f74696e6720706572696f64206d757374206265206772656174657220746860008201527f616e203000000000000000000000000000000000000000000000000000000000602082015250565b60006200017360248362000104565b9150620001808262000115565b604082019050919050565b60006020820190508181036000830152620001a68162000164565b9050919050565b61153480620001bd6000396000f3fe608060405234801561001057600080fd5b50600436106102065760003560e01c806359529edd1161011a578063cabd464d116100ad578063d68b4c361161007c578063d68b4c36146106b1578063dd4e2ba5146106e1578063eb9019d4146106ff578063f8ce560a1461072f578063fb03ec6f1461075f57610206565b8063cabd464d14610605578063d06efeda14610621578063d3a368bd14610651578063d4a8dd981461068157610206565b80639aeb962b116100e95780639aeb962b146105695780639cbe5efd14610599578063bd85948c146105b7578063bed73010146105d557610206565b806359529edd146104bb5780637ace2485146104eb57806382afd23b1461051b57806391ddadf41461054b57610206565b8063438596321161019d5780635320a1471161016c5780635320a1471461041557806353ed63991461044557806354fd4d5014610461578063561b64ef1461047f578063593728121461049d57610206565b80634385963214610367578063498d91bf146103975780634bb5181a146103c75780634bf5d7e9146103f757610206565b80630eca87fb116101d95780630eca87fb146102a757806319e6e158146102d757806330097377146103075780633e4f49e61461033757610206565b806301ffc9a71461020b57806302a251a31461023b57806306fdde03146102595780630a0e74ef14610277575b600080fd5b61022560048036038101906102209190610bd0565b61078f565b6040516102329190610c18565b60405180910390f35b610243610796565b6040516102509190610c4c565b60405180910390f35b6102616107a0565b60405161026e9190610cf7565b60405180910390f35b610291600480360381019061028c9190610d45565b6107a5565b60405161029e9190610c4c565b60405180910390f35b6102c160048036038101906102bc9190610d45565b6107ac565b6040516102ce9190610c4c565b60405180910390f35b6102f160048036038101906102ec9190610d45565b6107b3565b6040516102fe9190610c4c565b60405180910390f35b610321600480360381019061031c9190610d45565b6107ba565b60405161032e9190610c4c565b60405180910390f35b610351600480360381019061034c9190610d45565b6107c1565b60405161035e9190610de9565b60405180910390f35b610381600480360381019061037c9190610e62565b6107eb565b60405161038e9190610c18565b60405180910390f35b6103b160048036038101906103ac9190610d45565b6107f3565b6040516103be9190610c4c565b60405180910390f35b6103e160048036038101906103dc9190610ed8565b6107fa565b6040516103ee9190610c4c565b60405180910390f35b6103ff610802565b60405161040c9190610cf7565b60405180910390f35b61042f600480360381019061042a9190610d45565b610807565b60405161043c9190610f27565b60405180910390f35b61045f600480360381019061045a919061114d565b610844565b005b610469610849565b6040516104769190610cf7565b60405180910390f35b61048761084e565b6040516104949190610c4c565b60405180910390f35b6104a561086a565b6040516104b29190610c4c565b60405180910390f35b6104d560048036038101906104d09190610d45565b610886565b6040516104e29190610c4c565b60405180910390f35b61050560048036038101906105009190610d45565b61088d565b6040516105129190611296565b60405180910390f35b61053560048036038101906105309190610d45565b610894565b6040516105429190610c18565b60405180910390f35b6105536108e4565b60405161056091906112d9565b60405180910390f35b610583600480360381019061057e91906112f4565b6108e9565b6040516105909190610c18565b60405180910390f35b6105a16108f0565b6040516105ae9190610c4c565b60405180910390f35b6105bf6108f9565b6040516105cc9190610c4c565b60405180910390f35b6105ef60048036038101906105ea9190610ed8565b610aee565b6040516105fc9190610c4c565b60405180910390f35b61061f600480360381019061061a9190610d45565b610af6565b005b61063b60048036038101906106369190610d45565b610b00565b6040516106489190610c4c565b60405180910390f35b61066b60048036038101906106669190610d45565b610b1d565b6040516106789190610c4c565b60405180910390f35b61069b60048036038101906106969190610d45565b610b3a565b6040516106a89190610c18565b60405180910390f35b6106cb60048036038101906106c69190611321565b610b41565b6040516106d89190610c18565b60405180910390f35b6106e9610b49565b6040516106f69190610cf7565b60405180910390f35b61071960048036038101906107149190611361565b610b4e565b6040516107269190610c4c565b60405180910390f35b61074960048036038101906107449190610d45565b610b56565b6040516107569190610c4c565b60405180910390f35b61077960048036038101906107749190610d45565b610b5d565b6040516107869190610c4c565b60405180910390f35b6000919050565b6000600154905090565b606090565b6000919050565b6000919050565b6000919050565b6000919050565b60006002600083815260200190815260200160002060009054906101000a900460ff169050919050565b600092915050565b6000919050565b600092915050565b606090565b60006005600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b505050565b606090565b6000600360008054815260200190815260200160002054905090565b6000600460008054815260200190815260200160002054905090565b6000919050565b6060919050565b60008060028111156108a9576108a8610d72565b5b6002600084815260200190815260200160002060009054906101000a900460ff1660028111156108dc576108db610d72565b5b149050919050565b600090565b6000919050565b60008054905090565b60004360046000805481526020019081526020016000205410610951576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610948906113ed565b60405180910390fd5b6001600080828254610963919061143c565b92505081905550600054905060006002600083815260200190815260200160002060006101000a81548160ff021916908360028111156109a6576109a5610d72565b5b0217905550436003600083815260200190815260200160002081905550600154436109d1919061143c565b6004600083815260200190815260200160002081905550336005600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060028060006001600054610a4e9190611470565b815260200190815260200160002060006101000a81548160ff02191690836002811115610a7e57610a7d610d72565b5b021790555060607fed97f3daa22d7f521cfac2156e927c837565dd6980bd67cc6f7e53cc52ea09c882336003600086815260200190815260200160002054600460008781526020019081526020016000205485604051610ae29594939291906114a4565b60405180910390a15090565b600092915050565b8060018190555050565b600060036000838152602001908152602001600020549050919050565b600060046000838152602001908152602001600020549050919050565b6000919050565b600092915050565b606090565b600092915050565b6000919050565b6000919050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b610bad81610b78565b8114610bb857600080fd5b50565b600081359050610bca81610ba4565b92915050565b600060208284031215610be657610be5610b6e565b5b6000610bf484828501610bbb565b91505092915050565b60008115159050919050565b610c1281610bfd565b82525050565b6000602082019050610c2d6000830184610c09565b92915050565b6000819050919050565b610c4681610c33565b82525050565b6000602082019050610c616000830184610c3d565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ca1578082015181840152602081019050610c86565b60008484015250505050565b6000601f19601f8301169050919050565b6000610cc982610c67565b610cd38185610c72565b9350610ce3818560208601610c83565b610cec81610cad565b840191505092915050565b60006020820190508181036000830152610d118184610cbe565b905092915050565b610d2281610c33565b8114610d2d57600080fd5b50565b600081359050610d3f81610d19565b92915050565b600060208284031215610d5b57610d5a610b6e565b5b6000610d6984828501610d30565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60038110610db257610db1610d72565b5b50565b6000819050610dc382610da1565b919050565b6000610dd382610db5565b9050919050565b610de381610dc8565b82525050565b6000602082019050610dfe6000830184610dda565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610e2f82610e04565b9050919050565b610e3f81610e24565b8114610e4a57600080fd5b50565b600081359050610e5c81610e36565b92915050565b60008060408385031215610e7957610e78610b6e565b5b6000610e8785828601610d30565b9250506020610e9885828601610e4d565b9150509250929050565b6000819050919050565b610eb581610ea2565b8114610ec057600080fd5b50565b600081359050610ed281610eac565b92915050565b60008060408385031215610eef57610eee610b6e565b5b6000610efd85828601610d30565b9250506020610f0e85828601610ec3565b9150509250929050565b610f2181610e24565b82525050565b6000602082019050610f3c6000830184610f18565b92915050565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610f7f82610cad565b810181811067ffffffffffffffff82111715610f9e57610f9d610f47565b5b80604052505050565b6000610fb1610b64565b9050610fbd8282610f76565b919050565b600067ffffffffffffffff821115610fdd57610fdc610f47565b5b602082029050602081019050919050565b600080fd5b600061100661100184610fc2565b610fa7565b9050808382526020820190506020840283018581111561102957611028610fee565b5b835b81811015611052578061103e8882610ec3565b84526020840193505060208101905061102b565b5050509392505050565b600082601f83011261107157611070610f42565b5b8135611081848260208601610ff3565b91505092915050565b600067ffffffffffffffff8211156110a5576110a4610f47565b5b602082029050602081019050919050565b60006110c96110c48461108a565b610fa7565b905080838252602082019050602084028301858111156110ec576110eb610fee565b5b835b8181101561111557806111018882610d30565b8452602084019350506020810190506110ee565b5050509392505050565b600082601f83011261113457611133610f42565b5b81356111448482602086016110b6565b91505092915050565b60008060006060848603121561116657611165610b6e565b5b600061117486828701610d30565b935050602084013567ffffffffffffffff81111561119557611194610b73565b5b6111a18682870161105c565b925050604084013567ffffffffffffffff8111156111c2576111c1610b73565b5b6111ce8682870161111f565b9150509250925092565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61120d81610ea2565b82525050565b600061121f8383611204565b60208301905092915050565b6000602082019050919050565b6000611243826111d8565b61124d81856111e3565b9350611258836111f4565b8060005b838110156112895781516112708882611213565b975061127b8361122b565b92505060018101905061125c565b5085935050505092915050565b600060208201905081810360008301526112b08184611238565b905092915050565b600065ffffffffffff82169050919050565b6112d3816112b8565b82525050565b60006020820190506112ee60008301846112ca565b92915050565b60006020828403121561130a57611309610b6e565b5b600061131884828501610e4d565b91505092915050565b6000806040838503121561133857611337610b6e565b5b600061134685828601610ec3565b925050602061135785828601610d30565b9150509250929050565b6000806040838503121561137857611377610b6e565b5b600061138685828601610e4d565b925050602061139785828601610d30565b9150509250929050565b7f43757272656e7420726f756e64206d75737420626520656e6465640000000000600082015250565b60006113d7601b83610c72565b91506113e2826113a1565b602082019050919050565b60006020820190508181036000830152611406816113ca565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061144782610c33565b915061145283610c33565b925082820190508082111561146a5761146961140d565b5b92915050565b600061147b82610c33565b915061148683610c33565b925082820390508181111561149e5761149d61140d565b5b92915050565b600060a0820190506114b96000830188610c3d565b6114c66020830187610f18565b6114d36040830186610c3d565b6114e06060830185610c3d565b81810360808301526114f28184611238565b9050969550505050505056fea26469706673582212202d6e3a879dc0f6503a12a5d165a9506f596bb064f16a0c38a93487dbce14adb064736f6c63430008140033";

type XAllocationVotingGovernorMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: XAllocationVotingGovernorMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class XAllocationVotingGovernorMock__factory extends ContractFactory {
  constructor(...args: XAllocationVotingGovernorMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    votingPeriodInBlocks: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(votingPeriodInBlocks, overrides || {});
  }
  override deploy(
    votingPeriodInBlocks: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(votingPeriodInBlocks, overrides || {}) as Promise<
      XAllocationVotingGovernorMock & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): XAllocationVotingGovernorMock__factory {
    return super.connect(runner) as XAllocationVotingGovernorMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): XAllocationVotingGovernorMockInterface {
    return new Interface(_abi) as XAllocationVotingGovernorMockInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): XAllocationVotingGovernorMock {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as XAllocationVotingGovernorMock;
  }
}

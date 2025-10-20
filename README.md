上一条讲[干中学 Web3 的推文](https://x.com/AppSaildotDEV/status/1979122233630167473)爆了🔥

这次我们来点实战：从 0 到 1，亲手做一个最能串起 Web3 全流程的项目 —— **转账 DApp。**

**干中学 Web3（1）｜转账 DApp 实战**

先从最简单、最核心的项目开始：做一个转账 DApp。它能帮你把“区块链到底怎么跑起来的”这件事，一次性串个大概情况。

这一节我主要会带你搞清楚：

- 转账 DApp 的整体思路
- 转账 DApp 的 prompt（见评论区）
- 一些关键概念：区块链、智能合约、钱包、Gas Fee、DApp
- 如何搭建测试环境（我们用以太坊测试链）
- 各种账号注册、环境配置、工具安装全套流程
- 最后附上 GitHub 源码

为了给大家一个全局的了解，先看看最终成品的效果👇（图一）
![transfer-dapp](/images/transfer-dapp.jpg)

**转账 DApp 的大概思路**：我们将建立一个网页，链接上你的“数字钱包”，去调用一个发布在区块链上的智能合约（也就是我们的转账规则），从而完成交易。

你需要先有个钱包，这里以 MetaMask 为例，我已经连接好了。

然后填上两个字段：

- 收款地址（你要转给谁）
- 转账金额（转几个 ETH）

点确认后，交易就发出去了。
![transfer](/images/send.jpg)

如上图所示，转账记录出来了，有点像银行流水，只不过多了详细的 Gas Fee、交易哈希这些链上信息。

先有这么个大概印象就行，下面我慢慢讲，这个 DApp 是怎么一步步实现的，在深入之前，先简单介绍一下几个相关概念。

**DApp（Decentralized Application 去中心化应用程序）**：是在区块链网络上运行的应用程序，看起来与常规的 App 相似，但它们的后端系统却截然不同。DApp 运行依靠的是分布式网络上的智能合约而不是中心化系统，本次 Demo 演示的转账 Dapp，于传统银行转账 App 的区别在于：银行 App 连接的是银行的私有服务器，一切由银行说了算。而我们的 DApp，连接的是一个不属于任何人区块链系统。

**那么什么是智能合约？**
智能合约 (Smart Contract) 是 DApp 的核心和灵魂。
简单理解: 它是一段自动执行的、规则公开透明的代码，一旦部署到区块链上，就无法被篡改。

与银行业务做个对比：
你去银行办理业务，遵循的是银行厚厚的规章制度和纸质合同。这些规则且由银行的员工来解释和执行，过程可能缓慢、不透明，甚至会出错。
而智能合约，就像一台金融自动售货机。它的所有规则都预先写成了代码。任何人都可以查看这些代码规则。他会自动、强制、精准地执行相应的操作，没有任何中间人干预。
总结一下：智能合约就是 DApp 写在区块链上的、不可篡改的、会自动执行的“后端服务条款”。

这些基础概念先混个脸熟，如果能够理解就更好了，下面开始 vibe coding！

**Prompt**：“我想在 ETH 上面部署一个智能合约(先部署测试链)，能够完成转账功能，整体流程大概如何”

将这段 Prompt 复制粘贴到 Nora 的聊天框里面，模型选择 Claude 4 Sonnet，Auto Approve 尽可能给出所有权限：Edit file、Write file、Execute all commands。

⚠️ 这种完全给出权限的操作仅限 Demo 环节，生产环境请不要这么做！这样 Nora 可以自动话完全执行所有的动作。

开始执行！

Nora 自动生成了所有的代码，简单介绍一下：

1. 智能合约 (Smart Contract)
Transfer.sol
用途: 这是项目的核心，是我们的智能合约代码。它使用 Solidity 语言编写，定义了在以太坊区块链上执行转账操作的规则和逻辑。它就是我们 DApp 的“后端”。
2. DApp 前端 (Frontend)
index.html
用途: 这是用户能看到的网页界面。它提供输入框和按钮，让用户可以轻松地与部署在区块链上的智能合约进行交互，而无需编写任何代码。
3. 编译和部署工具 (Scripts & Tooling)
这些 .js 文件是用来辅助开发和交互的命令行脚本，通常由开发者在终端中运行。

compile.js
用途: 编译 Transfer.sol 文件。它会读取 Solidity 代码，并将其转换成以太坊虚拟机（EVM）可以理解的字节码 (Bytecode) 和一个叫做 ABI 的接口文件。

Transfer.json
用途: 这是 compile.js 成功运行后生成的输出文件。它包含了合约的 ABI（Application Binary Interface，相当于合约的 API 说明书）和字节码。其他脚本需要读取这个文件来与合约交互。

deploy.js
用途: 部署合约。它会读取 Transfer.json 中的字节码，然后通过 web3.js 将其发布到以太坊网络上。部署成功后，合约就会拥有一个永久的地址。

transfer.js
用途: 一个命令行转账工具。它允许开发者在不使用 index.html 前端的情况下，直接通过终端调用已部署合约的 send 函数来发起一笔转账。非常适合用于测试或自动化脚本。

checkBalance.js
用途: 一个查询余额的工具。用来检查指定钱包地址在链上有多少以太币。

getContractAddress.js
用途: 一个获取合约地址的工具。在部署交易被发送后，可以用这个脚本通过交易哈希（TxHash）来查询最终生成的合约地址。

编码完成之后，便是准备部署啦，我们计划讲上面的智能合约部署到以太坊测试链 Sepolia 上，有一些基础的工作需要先去完成。

### 1. 获取测试币

在 Sepolia 测试网上部署合约和发送交易都需要支付 Gas 费，因此我们需要先获取一些免费的 Sepolia ETH。你可以通过以下常用的水龙头网站获取：

-   **[sepoliafaucet.com](https://sepoliafaucet.com/) (Alchemy)**：需要注册一个免费的 Alchemy 账户，Fast and reliable. 0.1 Sepolia ETH / 72 hrs，有时会要求主网上有少量真实 ETH 余额。
-   **[infura.io/faucet/sepolia](https://infura.io/faucet/sepolia) (Infura)**：需要注册 Infura 账户，登录后即可使用。
-   **[faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia) (QuickNode)**：通常需要连接钱包，有时会要求主网上有少量真实 ETH 余额。

**操作步骤**：
1.  从你的钱包（例如 MetaMask）复制你的以太坊地址。
2.  访问以上任一水龙头网站。
3.  粘贴你的地址，完成人机验证，然后提交请求。
4.  几分钟后，你的钱包就应该能收到测试用的 ETH 了。

### 2. 准备钱包和私钥

部署合约需要一个钱包账户来签署交易。我们建议使用像 MetaMask 这样的浏览器插件钱包，并且**务必使用一个全新的、仅用于开发的测试账户**，只在里面存极少的真实资产 0.001 ETH。

-   **安装 MetaMask**：如果尚未安装，请从官网 [metamask.io](https://metamask.io) 安装。
-   **创建测试账户**：在 MetaMask 中创建一个新账户，并为其命名（例如 "Contract Deployer"）以便区分。
-   **导出私钥**：
    1.  确保选中了你的测试账户。
    2.  点击账户旁边的三个点 (⋮) 菜单，选择 “账户详情”。
    3.  点击 “导出私钥”，并输入你的 MetaMask 密码。
    4.  你会看到一串 64 位的十六进制字符串，这就是你的**私钥**。**请绝对保密，不要泄露给任何人！**

### 3. 获取 RPC 节点 URL

为了让我们的部署脚本能够连接到以太坊网络，我们需要一个 RPC (Remote Procedure Call) 节点 URL。你可以从 Infura 或 Alchemy 等节点服务商免费获取。

-   **注册 Infura/Alchemy**：访问 [infura.io](https://infura.io) 或 [alchemy.com](https://alchemy.com) 并创建一个免费账户。
-   **创建项目**：登录后，创建一个新的 Web3 项目。
-   **获取 URL**：在你的项目面板中，选择 Sepolia 网络，然后复制对应的 HTTPS 端点地址。这个地址看起来会像 `https://sepolia.infura.io/v3/your-api-key`。

### 4. 创建 `.env` 配置文件

为了安全地管理我们的私钥和 RPC URL，我们将在项目根目录下创建一个 `.env` 文件。这个文件用于存放敏感信息，并且**不应该**被提交到代码版本控制中（例如 Git）。

在你的项目根目录下，创建一个名为 `.env` 的文件，并填入以下内容：

```env
# 从 Infura 或 Alchemy 获取的 Sepolia 测试网 RPC URL
RPC_URL="https://sepolia.infura.io/v3/your-api-key"

# 从你仅用于测试的 MetaMask 账户导出的私钥
PRIVATE_KEY="your_64_character_private_key_here"
```

> **安全提示**：请确保你的项目根目录下的 `.gitignore` 文件中包含了 `.env` 这一行，以防止意外上传。

完成以上所有准备工作后，你的开发环境就已经配置完毕，随时可以开始执行部署脚本了。

在项目目录下运行 node deploy.js 命令来启动部署流程。
脚本会使用您在 .env 文件中配置的 RPC_URL 和 PRIVATE_KEY。

```
[dotenv@17.2.3] injecting env (2) from .env -- tip: 👥 sync secrets across teammates & machines: https://dotenvx.com/ops
Attempting to deploy from account: 0x64E42FaB8ca309f25DEcebc787ec2c7590E3Ba72
Gas estimation: 262904, using: 315485
Transaction Hash: undefined
Contract deployed to: 0x05D87D297B7ccB7C10bCEe8b0f326eBf60f21f9E
```

智能合约已经成功部署到 Sepolia 测试网络。
合约地址: 0x05D87D297B7ccB7C10bCEe8b0f326eBf60f21f9E
您现在可以通过 Sepolia Etherscan 区块链浏览器查看和验证您的合约。点击下面的链接可以直接访问：
https://sepolia.etherscan.io/address/0x05D87D297B7ccB7C10bCEe8b0f326eBf60f21f9E

然后我们就可以打开前端页面来进行转账啦
```
npx http-server -o
```

访问 http://127.0.0.1:8081 ，链接钱包，输入转账目标地址和金额，发送！

等等，转账都转完了，可是我们还没有看过源代码啊！

简单看一下最核心的代码 Transfer.sol

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Transfer
 * @dev 一个基础的以太币转账合约。
 * @author Nora AI
 */
contract Transfer {
    /// @notice 合约的部署者（所有者）地址。
    address public owner;

    /**
     * @notice 当一笔转账成功时触发。
     * @param from 资金的发送方地址。
     * @param to 资金的接收方地址。
     * @param amount 转移的以太币数量 (单位: wei)。
     */
    event Sent(address indexed from, address indexed to, uint256 amount);

    /**
     * @notice 构造函数，在合约部署时设置所有者。
     * @dev 将合约的 `owner` 设置为部署该合约的账户地址 (`msg.sender`)。
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice 接收ETH并立即将其转发给指定的 `_to` 地址。
     * @dev 这是一个 payable 函数，意味着它可以在被调用时接收ETH。
     *      它会校验接收方不能是零地址，然后将收到的所有ETH (`msg.value`) 转发。
     * @param _to 资金的接收方地址，必须是 payable 类型。
     */
    function send(address payable _to) public payable {
        // 确保接收地址不是无效的零地址
        require(_to != address(0), "Cannot send to zero address");

        // 执行转账
        _to.transfer(msg.value);

        // 触发转账成功事件，记录日志
        emit Sent(msg.sender, _to, msg.value);
    }
}
```

这就是一个智能合约！他的功能非常纯粹：它作为一个中转站，允许任何人通过调用它的 send 函数，将以太币发送给另一个指定的地址。

但智能合约的潜力远不止于此。我们可以把它理解为一台部署在区块链上的 “自动执行的数字协议”。它具有几个革命性的特点：

*   **不可篡改 (Immutable)**: 一旦合约被部署到区块链上，它的代码就无法被修改。就像自动售货机出厂后，它的内部机械结构就固定了。这保证了规则的绝对稳定和可信。

*   **公开透明 (Transparent)**: 任何人都可以查看合约的源代码（如果已验证），清楚地了解它的所有规则和逻辑，完全杜绝了“黑箱操作”的可能。

*   **自动执行 (Autonomous & Deterministic)**: 合约会根据预设的条件自动、精确地执行。只要条件被触发（例如，有人向它发送了以太币），相应的操作就一定会发生，没有任何中间人干预，也排除了人为错误或舞弊的风险。

*   **去中心化 (Decentralized)**: 它不运行在任何单一的服务器上，而是由全球成千上万的计算机（节点）共同维护和验证，这使得它极难被攻击、关闭或审查。

这些特性共同构成了智能合约的核心价值：**Code is Law**。它用程序化的信任取代了对传统中介机构（如银行、律师、平台公司）的依赖，从而可以构建出无需许可、抗审查、全天候运行的强大应用。

除了我们这个简单的转账功能，智能合约还能构建出极其复杂的系统，例如：
*   **去中心化金融 (DeFi)**: 自动化的借贷平台 (Aave)、交易所 (Uniswap)。
*   **数字收藏品 (NFTs)**: 定义了数字艺术品或游戏道具的唯一所有权和交易规则。
*   **去中心化自治组织 (DAOs)**: 完全由代码和成员投票来管理的组织或公司。

总而言之，我们这个小小的 `Transfer` 合约，正是通往这个宏大、自动化世界的一扇门。此智能合约使用 Solidity 开发，有志于从事 Web3 开发的朋友，可以深入学习一下 [Solidity](https://www.soliditylang.org/)。


在这里，我很想跟大家介绍一下 Nora 的另一个用法，除了编码工作以外，他其实可以回答很多问题，比如：

我将 https://sepolia.etherscan.io/address/0x05D87D297B7ccB7C10bCEe8b0f326eBf60f21f9E 这里部署好的合约，链接直接发给 Nora，请分析这里面的信息，他做了很详细的讲解，我建议所有看到这的朋友，也这么做一次，能加深你对很多概念的理解。

![sepolia.etherscan.io](/images/sepoliascan.png)

我还问了很多问题：
在哪里获取 正确的 RPC_URL 和 PRIVATE_KEY？
如何获取免费的 Sepolia ETH？

你想想，我做这个项目的时候也完全是个新人，我能知道这么多吗，其实很多问题都是频繁去 Nora，他会不厌其烦的回答你的任何问题，甚至，上文中写的很多内容都是 Nora 生成的。

如果你有兴趣看到这里了，那真的铁杆粉丝哈，欢迎到 X 上的 [干中学 Web3（1）｜转账 DApp 实战](https://x.com/AppSaildotDEV/status/1979389583893893564) 评论区互动，我会及时响应，还加入微信群一起学习，谢谢。
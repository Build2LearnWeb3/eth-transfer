上一条讲[「怎么干中学 Web3」的推文](https://x.com/AppSaildotDEV/status/1979122233630167473)爆了🔥

这次我们来点实战：从 0 到 1，亲手做一个最能串起 Web3 全流程的项目 —— **转账 DApp。**

**干中学 Web3（1）｜转账 DApp 实战**

先从最简单、最核心的项目开始：**做一个转账 DApp。**它能帮你把“区块链到底怎么跑起来的”这件事，一次性串个大概情况。

这一节我主要会带你搞清楚：

- 转账 DApp 的整体思路
- 转账 DApp 的 prompt（见评论区）
- 一些关键概念：区块链、智能合约、钱包、Gas Fee、DApp
- 如何搭建测试环境（我们用以太坊测试链）
- 各种账号注册、环境配置、工具安装全套流程
- 最后附上 GitHub 源码

为了给大家一个全局的了解，先看看最终成品的效果👇（图一）
![transfer-dapp](/images/transfer-dapp.jpg)

转账 DApp 的大概思路：我们将建立一个网页，链接上你的“数字钱包”，去调用一个发布在区块链上的智能合约（也就是我们的转账规则），从而完成交易。

你需要先有个钱包，这里以 MetaMask 为例，我已经连接好了。

然后填上两个字段：

- 收款地址（你要转给谁）
- 转账金额（转几个 ETH）

点确认后，交易就发出去了。

如图二所示，转账记录出来了，有点像银行流水，只不过多了详细的 Gas Fee、交易哈希这些链上信息。

先有这么个大概印象就行，下面我慢慢讲，这个 DApp 是怎么一步步实现的，在深入之前，先简单介绍一下几个相关概念。

DApp（Decentralized Application 去中心化应用程序）：是在区块链网络上运行的应用程序，看起来与常规的 App 相似，但它们的后端系统却截然不同。DApp 运行依靠的是分布式网络上的智能合约而不是中心化系统，本次 Demo 演示的转账 Dapp，于传统银行转账 App 的区别在于：银行 App 连接的是银行的私有服务器，一切由银行说了算。而我们的 DApp，连接的是一个不属于任何人区块链系统。

那么什么是智能合约？
智能合约 (Smart Contract) 是 DApp 的核心和灵魂。
简单理解: 它是一段自动执行的、规则公开透明的代码，一旦部署到区块链上，就无法被篡改。

与银行业务做个对比：
你去银行办理业务，遵循的是银行厚厚的规章制度和纸质合同。这些规则且由银行的员工来解释和执行，过程可能缓慢、不透明，甚至会出错。
而智能合约，就像一台金融自动售货机。它的所有规则都预先写成了代码。任何人都可以查看这些代码规则。他会自动、强制、精准地执行相应的操作，没有任何中间人干预。
总结一下：智能合约就是 DApp 写在区块链上的、不可篡改的、会自动执行的“后端服务条款”。

这些基础概念先混个脸熟，如果能够理解就更好了，下面开始 vibe coding！

# Prompt：

“我想在 ETH 上面部署一个智能合约(先部署测试链)，能够完成转账功能，整体流程大概如何”

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

编码完成之后，便是准备部署啦，我们计划讲上面的智能合约部署到以-太坊测试链 Sepolia 上，有一些基础的工作需要先去完成。

### 1. 获取测试币

在 Sepolia 测试网上部署合约和发送交易都需要支付 Gas 费，因此我们需要先获取一些免费的 Sepolia ETH。你可以通过以下常用的水龙头网站获取：

-   **[sepoliafaucet.com](https://sepoliafaucet.com/) (Alchemy)**：需要注册一个免费的 Alchemy 账户，每天可以稳定领取 0.5 Sepolia ETH。
-   **[infura.io/faucet/sepolia](https://infura.io/faucet/sepolia) (Infura)**：需要注册 Infura 账户，登录后即可使用。
-   **[faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia) (QuickNode)**：通常需要连接钱包，有时会要求主网上有少量真实 ETH 余额。

**操作步骤**：
1.  从你的钱包（例如 MetaMask）复制你的以太坊地址。
2.  访问以上任一水龙头网站。
3.  粘贴你的地址，完成人机验证，然后提交请求。
4.  几分钟后，你的钱包就应该能收到测试用的 ETH 了。

### 2. 准备钱包和私钥

部署合约需要一个钱包账户来签署交易。我们强烈建议使用像 MetaMask 这样的浏览器插件钱包，并且**务必使用一个全新的、仅用于开发的测试账户**，只在里面存极少的真实资产 0.001 ETH。

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
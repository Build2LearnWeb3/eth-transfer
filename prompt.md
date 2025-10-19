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

![img](images/sepolia-faucet.jpg)

### 2. 准备钱包和私钥

部署合约需要一个钱包账户来签署交易。我们强烈建议使用像 MetaMask 这样的浏览器插件钱包，并且**务必使用一个全新的、仅用于开发的测试账户**，不要在里面存放任何真实资产。

-   **安装 MetaMask**：如果尚未安装，请从官网 [metamask.io](https://metamask.io) 安装。
-   **创建测试账户**：在 MetaMask 中创建一个新账户，并为其命名（例如 "Contract Deployer"）以便区分。
-   **导出私钥**：
    1.  确保选中了你的测试账户。
    2.  点击账户旁边的三个点 (⋮) 菜单，选择 “账户详情”。
    3.  点击 “导出私钥”，并输入你的 MetaMask 密码。
    4.  你会看到一串 64 位的十六进制字符串，这就是你的**私钥**。**请绝对保密，不要泄露给任何人！**

![img](images/export-private-key.jpg)

### 3. 获取 RPC 节点 URL

为了让我们的部署脚本能够连接到以太坊网络，我们需要一个 RPC (Remote Procedure Call) 节点 URL。你可以从 Infura 或 Alchemy 等节点服务商免费获取。

-   **注册 Infura/Alchemy**：访问 [infura.io](https://infura.io) 或 [alchemy.com](https://alchemy.com) 并创建一个免费账户。
-   **创建项目**：登录后，创建一个新的 Web3 项目。
-   **获取 URL**：在你的项目面板中，选择 Sepolia 网络，然后复制对应的 HTTPS 端点地址。这个地址看起来会像 `https://sepolia.infura.io/v3/your-api-key`。

![img](images/infura-rpc-url.jpg)

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
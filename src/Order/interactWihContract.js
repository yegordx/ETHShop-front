import Web3 from "web3";
import contractABI from "./Contract.json";

const contractAddress = "0xfce8d010c168cb2aad643fa9f21b115cf7a99988"; 
const web3 = new Web3(window.ethereum);

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function interactWithContract(sellerAddress, amount) {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();

    const createPaymentResult = await contract.methods
      .createPayment(sellerAddress)
      .send({ from: accounts[0], value: web3.utils.toWei(amount.toString(), "ether") });

    console.log("Transaction result from createPayment:", createPaymentResult);

    const txHash = createPaymentResult.transactionHash;

    const paymentId = createPaymentResult.events.PaymentCreated.returnValues.paymentId;

    const storeHashResult = await contract.methods
      .storeTransactionHash(txHash, paymentId)
      .send({ from: accounts[0] });

    console.log("Transaction result from storeTransactionHash:", storeHashResult);
    return txHash;
  } catch (error) {
    console.error("Error interacting with contract:", error);
  }
}

export default interactWithContract;


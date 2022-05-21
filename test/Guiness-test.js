const chai = require("./chaisetup.js");
const expect = chai.expect;
const BN = web3.utils.BN;

const Guiness = artifacts.require("GuinessToken");

// Traditional Truffle test
contract("Guiness", (accounts) => {

  const [ initialHolder, recipient, anotherAccount ] = accounts;
  const TOTAL_AMOUNT_OF_GUINESS = process.env.INITIAL_TOKENS;

  beforeEach(async () => {
    this.guiness = await Guiness.new("Guiness", "GNS", TOTAL_AMOUNT_OF_GUINESS); // we use new instead of deploy/deployed
  });

  it("Guiness token must be deployed", async () => {
    return expect(this.guiness).to.not.be.undefined;
  });

  it("All tokens should be in my account", async () => {
    let totalSupply = await this.guiness.totalSupply();
    return expect(await this.guiness.balanceOf(initialHolder)).to.be.a.bignumber.equal(totalSupply);
  });

  //have to balance the amount of awaits and eventually to make the test happy :)
  it("I can send tokens from Account 1 to Account 2", async () => {
    const sendTokens = 1;
    let totalSupply = await this.guiness.totalSupply();

    await expect(this.guiness.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    let transferTokensResult = this.guiness.transfer(recipient, sendTokens);
    await expect(transferTokensResult).to.eventually.be.fulfilled;
    let balanceOfInitialHolder = await this.guiness.balanceOf(initialHolder);
    let expectedBalance = totalSupply.sub(new BN(sendTokens));
    await expect(balanceOfInitialHolder).to.be.a.bignumber.equal(expectedBalance);
    let balanceOfRecipient = await this.guiness.balanceOf(recipient);
    let tokensSent = new BN(sendTokens);
    return expect(balanceOfRecipient).to.be.a.bignumber.equal(tokensSent);
  });

  it("It's not possible to send more tokens than account 1 has", async () => {
    let balanceOfAccount = await this.guiness.balanceOf(initialHolder);
    expect(this.guiness.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;

    //check if the balance is still the same
    return expect(this.guiness.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);
  });
});

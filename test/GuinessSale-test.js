const chai = require("./chaisetup.js");
const expect = chai.expect;
const BN = web3.utils.BN;

const Guiness = artifacts.require("GuinessToken");
const GuinessKyc = artifacts.require("GuinessKyc");
const GuinessSale = artifacts.require("GuinessSale");

// Traditional Truffle test
contract("GuinessSale", (accounts) => {

  const [ initialHolder, recipient, anotherAccount ] = accounts;
  const TOTAL_AMOUNT_OF_GUINESS = process.env.INITIAL_TOKENS;

  beforeEach(async () => {
    this.guiness = await Guiness.new("Guiness", "GNS", TOTAL_AMOUNT_OF_GUINESS); // we use new instead of deploy/deployed
    this.guinessKyc = await GuinessKyc.new();
    this.guinessSale = await GuinessSale.new(1, initialHolder, this.guiness.address, this.guinessKyc.address);
    await this.guiness.transfer(this.guinessSale.address, TOTAL_AMOUNT_OF_GUINESS);
  });

  it("GuinessSale must be deployed", async () => {
    return expect(this.guiness).to.not.be.undefined;
  });

  it("Should not have any token in my deployer account", async () => {
    expect(this.guiness.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    let totalSupply = await this.guiness.totalSupply();
    let balanceOfTokenInContract = await this.guiness.balanceOf(this.guinessSale.address);
    return expect(balanceOfTokenInContract).to.be.a.bignumber.equal(new BN(totalSupply));
  });

  it("Should not be possible to buy tokens if Kyc is not completed", async () => {
    let balanceBefore = await this.guiness.balanceOf(recipient);
    await expect(this.guinessSale.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.rejected;
    return await expect(balanceBefore).to.be.bignumber.equal(await this.guiness.balanceOf.call(recipient));
  });

  it("Should be possible to buy tokens if Kyc is completed", async () => {
    let balanceBefore = await this.guiness.balanceOf(recipient);
    await this.guinessKyc.setKycCompleted(recipient);
    await expect(this.guinessSale.sendTransaction({from: recipient, value: web3.utils.toWei('1', 'Wei')})).to.eventually.be.fulfilled;
    balanceBefore = balanceBefore.add(new BN(1));
    return expect(this.guiness.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(balanceBefore);
  });

  xit("sending tokens", async () => {
    const sendTokens = 1;
    const guinessSale = await GuinessSale.new(1, initialHolder, this.guiness.address);
    await this.guiness.transfer(guinessSale.address, TOTAL_AMOUNT_OF_GUINESS);

    let totalSupply = await this.guiness.totalSupply();

    await expect(this.guiness.balanceOf(guinessSale.address)).to.eventually.be.a.bignumber.equal(totalSupply);
    await expect(web3.eth.sendTransaction({from: recipient, to:guinessSale.address, value: sendTokens}))
      .to.eventually.be.fulfilled;
    await expect(this.guiness.balanceOf(guinessSale.address)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
    return expect(this.guiness.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
  });
});

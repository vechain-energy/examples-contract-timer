const { ethers } = require('hardhat')
const { BigNumber } = ethers

const contracts = {}
let owner

beforeEach(async function () {
  [owner] = await ethers.getSigners()
  const Timer = await ethers.getContractFactory('Timer')
  contracts.Timer = await Timer.deploy()
})

describe('Timer', () => {
  it('supports setCountdownTo(time)', async () => {
    const now = Math.floor((new Date()) / 1000)
    await contracts.Timer.setCountdownTo(now)
  })

  it('provides access to timestamp', async () => {
    const now = Math.floor((new Date()) / 1000)
    await contracts.Timer.setCountdownTo(now)

    const timestamp = await contracts.Timer.timestamp()
    expect(timestamp).toEqual(BigNumber.from(now))
  })

  it('returns a countdown in seconds to the set timestamp', async () => {
    const futureSeconds = 3600
    const future = Math.floor((new Date()) / 1000) + futureSeconds
    await contracts.Timer.setCountdownTo(future)

    const countdown = await contracts.Timer.countdown()
    const countdownNumber = countdown.toNumber()

    // the test transactions need some seconds to run, testing for a timeframe of up to 10s difference
    expect(countdownNumber).toBeLessThan(futureSeconds)
    expect(countdownNumber).toBeGreaterThanOrEqual(futureSeconds - 10)
  })


  it('returns a countdown in seconds to the set timestamp', async () => {
    const futureMinutes = 60
    const future = Math.floor((new Date()) / 1000) + (futureMinutes * 60)
    await contracts.Timer.setCountdownTo(future)

    const countdown = await contracts.Timer.countdownMinutes()
    const countdownNumber = countdown.toNumber()

    // the test transactions need some seconds to run, testing for a timeframe of up to 10s difference
    expect(countdownNumber).toBeLessThan(futureMinutes)
    expect(countdownNumber).toBeGreaterThanOrEqual(futureMinutes - 1)
  })


  it('provides access to last timestamp of change', async () => {
    const blockTimestamp = Math.floor((new Date()) / 1000) + 3600
    await ethers.provider.send("evm_setNextBlockTimestamp", [blockTimestamp])

    await contracts.Timer.setCountdownTo(1)

    const timestamp = await contracts.Timer.changedAt()
    expect(timestamp).toEqual(BigNumber.from(blockTimestamp))
  })


})

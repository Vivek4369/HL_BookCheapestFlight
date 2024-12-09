import { test, expect , Page} from '@playwright/test';
import { Homepage, FlightSection, FlightDetailsSection } from '../locators/locators';
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
export class HP{
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    

    public async navigatetoFlightsHomePage() {
        await this.page.goto('https://www.easemytrip.com/flights.html', { waitUntil: 'domcontentloaded' });
    }

    async selectToDestination(){
        //select flight from
        await this.page.locator(Homepage.HomePageFlightFromLabel).click()
        await this.page.locator(Homepage.HomePageFlightFromInput).pressSequentially('delhi')
        await this.page.locator(Homepage.TopFlighShowing).first().click()
        await sleep(1000)
    }
    async selectFromDestination(){
        //select flight to
        // await page.locator(Homepage.HomePageFlightToLabel).click()
        await this.page.locator(Homepage.HomePageFlightToInput).pressSequentially('dehradun')
        await sleep(1000)
        await this.page.locator(Homepage.TopFlighShowing).nth(4).isVisible()
        await this.page.locator(Homepage.TopFlighShowing).nth(4).click()
    }

    async ValidateIncorrectPromoCode(PromoCode : string){
        //Test Invalid Coupan Cod
        if(await this.page.locator(FlightDetailsSection.ClearCoupanCodeButton).isVisible()){
            await this.page.locator(FlightDetailsSection.ClearCoupanCodeButton).click()
        }
        await this.page.locator(FlightDetailsSection.CoupanCodeInput).fill(PromoCode)
        await this.page.locator(FlightDetailsSection.CoupanCodeApplyButton).click()
        await expect(this.page.locator(FlightDetailsSection.CoupanCodeStatusText)).toContainText('Invalid Coupon')
    }

    async ValidateCorrectPromoCode(PromoCode : string){
        //Test Valid Coupan Codes
        if(await this.page.locator(FlightDetailsSection.ClearCoupanCodeButton).isVisible()){
            await this.page.locator(FlightDetailsSection.ClearCoupanCodeButton).click()
        }
        await this.page.locator(FlightDetailsSection.CoupanCodeInput).fill(PromoCode)
        await this.page.locator(FlightDetailsSection.CoupanCodeApplyButton).click()
        await expect(this.page.locator(FlightDetailsSection.CoupanCodeStatusText)).toContainText('Congratulations')
        // await expect(page.locator(FlightDetailsSection.GrandTotalPrice)).not.toHaveValue(lowestPrice)

    }

}

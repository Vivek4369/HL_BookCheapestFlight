import { test, expect , chromium, Page} from '@playwright/test';
import { Homepage, FlightSection, FlightDetailsSection } from '../locators/locators';
import { HP } from '../pages/Homepage';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


test.describe("Test to Book a flight in EaseMyTrip", async () =>{

  let page: Page;
  let flightHP: HP;

  test.beforeAll(async ({  }) => {
    const browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
    flightHP = new HP(page)
  });
  let lowestPrice = Infinity;
    test("Navigate to Ease My Trip Flight Homepage", async()=>{
        await flightHP.navigatetoFlightsHomePage();
    });
    test("Enter Details in Section Flights from and Flights to1", async ({})=>{
        
        await flightHP.navigatetoFlightsHomePage();
        await flightHP.selectToDestination();
        await flightHP.selectFromDestination();
        
    });

    test("Calendar : Find Cheapest Flight and select Date", async() =>{

        const calendarField = page.locator(Homepage.CalendarField);
        await expect(calendarField).toBeVisible();

        const dateElements = await page.locator(Homepage.CalendarDateElements).elementHandles()
        
        let cheapestDateElement = "";
        
        await sleep(3000)
        for (const dateElement of dateElements) {

            const priceText = await dateElement.$eval('span', el => el.textContent?.trim()); 
            console.log("price : ",priceText)
            const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
            
            if (price < lowestPrice) {
              lowestPrice = price;
              cheapestDateElement = await dateElement.textContent();
            }
          }
        let selectDate = ""

        selectDate = selectDate.concat(Homepage.CalendarDateElements,'[text()="',cheapestDateElement.split("₹",1),'"]')

        await page.locator(selectDate).click()
        await page.locator(Homepage.HomePageSearchButton).click()

    });
    test("All Flights Showing Section : Select First flight", async() =>{

        //FLIGHT SHOWING PAGE :::
        await page.locator(FlightSection.FlightBookButton).first().click() 

    });
    test("Check if Grand Total Price is Matching the Cheapest Flight Price", async() =>{
        //Test the Price of the Flight
        const FinalPriceText = String(await page.locator(FlightDetailsSection.GrandTotalPrice).textContent() )
        const FinalPrice = parseInt(FinalPriceText.replace(/[^0-9]/g, ''), 10);

        if( FinalPrice == lowestPrice){
          console.log("Cheapest Flight Price equals to Grand Total of the Flight")
        }
    });
    test("Test Invalid Promo Code", async() =>{
        //Test Invalid Coupan Code
        await page.locator(FlightDetailsSection.ClearCoupanCodeButton).click()
        await page.locator(FlightDetailsSection.CoupanCodeInput).fill('Invalid Code')
        await page.locator(FlightDetailsSection.CoupanCodeApplyButton).click()
        await expect(page.locator(FlightDetailsSection.CoupanCodeStatusText)).toContainText('Invalid Coupon')


    });


    test("Test Valid Promo Codes", async() =>{

        //Test Valid Coupan Codes

        await page.locator(FlightDetailsSection.CoupanCodeInput).fill('BESTDEAL')
        await page.locator(FlightDetailsSection.CoupanCodeApplyButton).click()
        await expect(page.locator(FlightDetailsSection.CoupanCodeStatusText)).toContainText('Congratulations')

        await page.locator(FlightDetailsSection.ClearCoupanCodeButton).click()
        await page.locator(FlightDetailsSection.CoupanCodeInput).fill('Delight')
        await page.locator(FlightDetailsSection.CoupanCodeApplyButton).click()
        await expect(page.locator(FlightDetailsSection.CoupanCodeStatusText)).toContainText('Congratulations')
        // await expect(page.locator(FlightDetailsSection.GrandTotalPrice)).not.toHaveValue(lowestPrice)

    });


});

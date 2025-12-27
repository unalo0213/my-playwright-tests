# Pre Booking List Plan - Zhonghe Dealership Only

## Application Overview

This test plan outlines the steps to navigate to the official website's preowned car list, focus on the Zhonghe dealership, collect all available car numbers there, and perform booking for each one. The list of booked cars will be saved in the specs folder as pre_booking_list.

## Test Scenarios

### 1. Zhonghe Dealership Booking Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 1.1. Collect and Book Zhonghe Cars

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Navigate to the preowned car list page at ${BASE_URL}/preowned/list
  2. Ensure user is logged in using authPage
  3. Locate and click on the '中和營業所' (Zhonghe Dealership) option
  4. Collect all car numbers (plate numbers) from the car listings in Zhonghe dealership
  5. For each car number, click the '預約賞車' button and complete the booking process (fill account, password, next steps)
  6. Compile a list of all booked car numbers
  7. Save the list to a file named pre_booking_list in the specs folder

**Expected Results:**
  - All car numbers from Zhonghe dealership collected and bookings attempted
  - List of car numbers saved to specs/pre_booking_list

### 2. Data Collection Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 2.1. Extract Zhonghe Car Numbers

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Navigate to ${BASE_URL}/preowned/list
  2. Click on '中和營業所'
  3. Use JavaScript evaluation to extract all car plate numbers from the Zhonghe dealership page
  4. Save the extracted list to specs/pre_booking_list

**Expected Results:**
  - List of all car numbers extracted from Zhonghe dealership

### 3. Booking Verification Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 3.1. Verify Zhonghe Bookings

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. After booking, check for success messages or booking confirmations
  2. Ensure no errors occurred during the process

**Expected Results:**
  - Confirmation that bookings were successful for Zhonghe cars

### 4. Edge Cases Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 4.1. Handle Unavailable Zhonghe Cars

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Check if '預約賞車' button is disabled or not present for some cars in Zhonghe
  2. Skip booking for unavailable cars and note them in the list

**Expected Results:**
  - Handle cases where cars in Zhonghe are already booked or unavailable

#### 4.2. Invalid Login Test for Zhonghe

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Attempt booking with wrong account/password
  2. Verify error handling and inability to proceed

**Expected Results:**
  - Test with invalid login credentials for Zhonghe bookings

#### 4.3. Multiple Bookings Test for Zhonghe

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Book several cars one after another in Zhonghe
  2. Ensure session remains active and no conflicts

**Expected Results:**
  - Test booking multiple cars in Zhonghe in sequence

### 5. Performance Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 5.1. Zhonghe Booking Time Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Measure time taken to book all Zhonghe cars
  2. Ensure it does not exceed timeout limits

**Expected Results:**
  - Bookings for Zhonghe cars completed within reasonable time

### 6. Accessibility Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 6.1. Zhonghe Keyboard Navigation Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Navigate the booking form using keyboard only
  2. Verify all steps can be completed without mouse

**Expected Results:**
  - Booking process for Zhonghe is accessible

#### 6.2. Zhonghe Screen Reader Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Use screen reader tools to verify labels and instructions are present

**Expected Results:**
  - Screen reader compatibility for Zhonghe

### 7. Cross-Browser Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 7.1. Zhonghe Browser Compatibility Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Run booking tests in Chromium, Firefox, and WebKit
  2. Ensure consistent behavior

**Expected Results:**
  - Booking works in different browsers for Zhonghe

### 8. Mobile Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 8.1. Zhonghe Mobile Booking Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Use mobile viewport and devices
  2. Complete booking process on mobile

**Expected Results:**
  - Booking works on mobile devices for Zhonghe

### 9. API Integration Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 9.1. Zhonghe API Validation Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Monitor network requests during booking
  2. Verify API responses for booking submissions

**Expected Results:**
  - Backend API calls are successful for Zhonghe bookings

### 10. Security Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 10.1. Zhonghe Security Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Check for SQL injection, XSS in input fields
  2. Ensure credentials are not exposed

**Expected Results:**
  - No security vulnerabilities during Zhonghe booking

### 11. Regression Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 11.1. Zhonghe Regression Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Run existing tests after booking changes
  2. Ensure no breaking changes

**Expected Results:**
  - Existing functionality still works after Zhonghe bookings

### 12. Load Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 12.1. Zhonghe Load Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Simulate multiple users booking Zhonghe cars simultaneously
  2. Check system performance under load

**Expected Results:**
  - System handles multiple Zhonghe bookings

### 13. Usability Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 13.1. Zhonghe Usability Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Gather user feedback on booking flow
  2. Identify and fix usability issues

**Expected Results:**
  - User-friendly booking process for Zhonghe

### 14. Localization Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 14.1. Zhonghe Localization Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Test booking in supported languages
  2. Verify translations are correct

**Expected Results:**
  - Booking works in different languages for Zhonghe

### 15. Compliance Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 15.1. Zhonghe Compliance Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Check GDPR, accessibility standards
  2. Ensure compliance

**Expected Results:**
  - Zhonghe booking complies with regulations

### 16. Integration Suite

**Seed:** `playwright/tests/seed.spec.ts`

#### 16.1. Zhonghe Integration Test

**File:** `specs/pre_booking_list.spec.ts`

**Steps:**
  1. Verify booking data is sent to backend systems
  2. Check email notifications, etc.

**Expected Results:**
  - Zhonghe booking integrates with other systems

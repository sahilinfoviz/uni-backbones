const {testEmail, testPhone, testPassword } = require('../../utils/regex');

// to check if testEmail is a function

test('testEmail function exists', () => {
    expect(typeof testEmail).toEqual('function');
  });

// test for valid email format  

test('valid email check', () => {
    expect(testEmail('sahil@gmail.com')).toBeTruthy();
  });

// test for invalid email format without @

test('invalid email check without @', () => {
    expect(testEmail('sahilgmail.com')).toBeFalsy();
  });

// test for invalid email format without . 

test('invalid email check without @', () => {
    expect(testEmail('sahil@gmailcom')).toBeFalsy();
  });


// to check if testPhone is a function

test('testPhone function exists', () => {
    expect(typeof testPhone).toEqual('function');
  });

// test for valid input format of phone number

test('valid phone check', () => {
    expect(testPhone('917735366908')).toBeTruthy();
  });

// test for invalid input format of phone number

test('invalid phone check', () => {
    expect(testPhone('3454234')).toBeFalsy();
  });

// to check if testPassword is a function

test('testPassword function exists', () => {
    expect(typeof testPassword).toEqual('function');
  });

// test for password without a cap alphabet

test('invalid password without a cap alphabet check', () => {
  expect(testPassword('sahil123@')).toBeFalsy();
});

// test for password without a cap alphabet

test('invalid password without a small alphabet check', () => {
  expect(testPassword('SAHIL123@')).toBeFalsy();
});

// test for password without a special character

test('invalid password without a special character check', () => {
  expect(testPassword('Sahil123')).toBeFalsy();
});

// test for password without a specific length 6>=password<=16

test('invalid password without a special character check', () => {
  expect(testPassword('Sal1@')).toBeFalsy();
});








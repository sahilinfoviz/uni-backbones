function testEmail(input) {
    const format = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return format.test(input);
  }
function testPhone(input) {
    const format = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return format.test(input);
  }
function testPassword(input) {
    const format = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return format.test(input);
  }


module.exports ={testEmail,testPhone,testPassword}
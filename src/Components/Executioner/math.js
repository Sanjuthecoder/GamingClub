export const generateMathProblem = (operator, digits) => {
    // Determine max value based on digits
    const maxVal = Math.pow(10, digits) - 1;
    const minVal = digits === 1 ? 1 : Math.pow(10, digits - 1);

    let a = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    let b = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    let answer = 0;

    // Ensure 'a' is always larger than 'b' to avoid negative answers for kids for subtraction
    // and make division cleaner.
    if (b > a) {
        let temp = a;
        a = b;
        b = temp;
    }

    switch (operator) {
        case '+':
            answer = a + b;
            break;
        case '-':
            answer = a - b;
            break;
        case '*':
            // To keep multiplication from getting completely out of hand for children, 
            // if digits > 1, maybe cap 'b' slightly lower. We'll stick to strict digit rules though.
            answer = a * b;
            break;
        case '/':
            // For division, we want a clean whole number answer.
            // So we generate 'answer' and 'b' first, and 'a' is the product.
            answer = a; // reuse 'a' as the answer
            a = answer * b;
            break;
        default:
            answer = a + b;
    }

    // Convert string for easy length extraction
    const answerStr = answer.toString();

    return {
        equationString: `${a} ${operator} ${b} = ?`,
        mathAnswer: answerStr
    };
};

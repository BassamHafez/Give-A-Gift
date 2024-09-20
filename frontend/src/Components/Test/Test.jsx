import React from 'react'

const Test = () => {


  // const checkBalance = () => {
  //   if (Number(cardPrice) === 0) {
  //     if (ProPrice) {
  //       if (Number(ProPrice) > Number(balance)) {
  //         notifyError(key("insuffBalance"));
  //         setIsBalanced(false);
  //         choosePaymentWay(paymentWay, "noBalance", cardPrice);
  //       }
  //     } else {
  //       setIsBalanced(true);
  //       choosePaymentWay("wallet", "balanced", cardPrice);
  //     }
  //     return;
  //   }

  //   if (priceAfterDisc !== "") {
  //     if (Number(priceAfterDisc) === 0) {
  //       if (ProPrice) {
  //         if (Number(ProPrice) > Number(balance)) {
  //           notifyError(key("insuffBalance"));
  //           setIsBalanced(false);
  //           choosePaymentWay(paymentWay, "noBalance", cardPrice);
  //         }
  //       } else {
  //         setIsBalanced(true);
  //         choosePaymentWay("wallet", "balanced", priceAfterDisc);
  //       }
  //       return;
  //     }
  //   }

  //   if (paymentWay === "wallet") {
  //     if (balanceCase) {
  //       if (priceAfterDisc !== "") {
  //         chargeCase(priceAfterDisc);
  //       } else {
  //         chargeCase(cardPrice);
  //       }
  //     } else if (ProPrice) {
  //       if (priceAfterDisc !== "") {
  //         if (
  //           (Number(VAT) / 100) * Number(priceAfterDisc) +
  //             Number(priceAfterDisc)+Number(ProPrice) >
  //           Number(balance)
  //         ) {
  //           notifyError(key("insuffBalance"));
  //           setIsBalanced(false);
  //           choosePaymentWay(paymentWay, "noBalance", priceAfterDisc);
  //         } else {
  //           setIsBalanced(true);
  //           choosePaymentWay(paymentWay, "balanced", priceAfterDisc);
  //         }
  //       } else {
  //         if (
  //           (Number(VAT) / 100) * Number(cardPrice) + Number(cardPrice)+Number(ProPrice) >
  //           Number(balance)
  //         ) {
  //           notifyError(key("insuffBalance"));
  //           setIsBalanced(false);
  //           choosePaymentWay(paymentWay, "noBalance", cardPrice);
  //         } else {
  //           setIsBalanced(true);
  //           choosePaymentWay(paymentWay, "balanced", cardPrice);
  //         }
  //       }
  //     } else {
  //       if (priceAfterDisc !== "") {
  //         if (
  //           (Number(VAT) / 100) * Number(priceAfterDisc) +
  //             Number(priceAfterDisc) >
  //           Number(balance)
  //         ) {
  //           notifyError(key("insuffBalance"));
  //           setIsBalanced(false);
  //           choosePaymentWay(paymentWay, "noBalance", priceAfterDisc);
  //         } else {
  //           setIsBalanced(true);
  //           choosePaymentWay(paymentWay, "balanced", priceAfterDisc);
  //         }
  //       } else {
  //         if (
  //           (Number(VAT) / 100) * Number(cardPrice) + Number(cardPrice) >
  //           Number(balance)
  //         ) {
  //           notifyError(key("insuffBalance"));
  //           setIsBalanced(false);
  //           choosePaymentWay(paymentWay, "noBalance", cardPrice);
  //         } else {
  //           setIsBalanced(true);
  //           choosePaymentWay(paymentWay, "balanced", cardPrice);
  //         }
  //       }
  //     }
  //   } else {
  //     if (priceAfterDisc !== "") {
  //       setIsBalanced(true);
  //       choosePaymentWay(paymentWay, "balanced", priceAfterDisc);
  //     } else {
  //       setIsBalanced(true);
  //       choosePaymentWay(paymentWay, "balanced", cardPrice);
  //     }
  //   }
  // };



  return (
    <div>
      test
    </div>
  )
}

export default Test

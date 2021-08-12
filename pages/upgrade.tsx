/**
 * In this implementation of Subscription UI we are always creating
 * a new account (this how it is setup in the backend api) and if
 * a customer has a card saved already then we can use that too for
 * subscribing to a plan (for this changes needs to be made in frontend
 * and backend of this app)
 */

import { useEffect, useRef, useState } from "react";
import Stripe from "stripe";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import Divider from "../components/common/divider";
import HeadingWithIcon from "../components/common/heading_with_icon";
import SizedBox from "../components/common/sized_box";
import { useUserData } from "../lib/hooks/user";
import { fetchFromAPI } from "../lib/utils";

function Upgrade() {
  const stripe = useStripe();
  const elements = useElements();
  const { user, username } = useUserData();

  const [plan, setPlan] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [displayForm, setDisplayForm] = useState(false);
  const planFormRef = useRef(null);

  // Fetch current subscriptions from the API
  const getSubscriptions = async () => {
    if (user) {
      const subs = await fetchFromAPI("payments/subscription/", {
        method: "GET",
        body: null,
      });
      setSubscriptions(subs);
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, [user]);

  // Cancel a subscription
  const cancel = async (id: string) => {
    setLoading(true);
    await fetchFromAPI("payments/subscription/" + id, {
      method: "PATCH",
      body: null,
    });
    alert("canceled!");
    await getSubscriptions();
    setLoading(false);
  };

  const createPaymentIntent = async (
    amount,
    plan,
    payment_method,
    userId,
    recepit_email
  ) => {
    // Clamp amount to Stripe min/max
    // const validAmount = Math.min(Math.max(amount, 50), 9999999);

    // Make the API Request
    const pi = await fetchFromAPI(`payments/payment`, {
      method: "POST",
      body: {
        amount,
        plan,
        payment_method,
        userId,
        recepit_email,
      },
    });
    return pi;
  };

  // Handle the submission of card details
  const handleSubmit = async (event) => {
    const oneTimePlan = "price_1JNDOBIW9OOyJTj3k2RAA27Q"; // 399

    try {
      if (plan !== oneTimePlan) {
        setLoading(true);
        event.preventDefault();

        const cardElement = elements.getElement(CardElement);

        // Create Payment Method
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        // Create Subscription on the Server
        const subscription = await fetchFromAPI("payments/subscription/", {
          method: "POST",
          body: {
            plan,
            payment_method: paymentMethod.id,
          },
        });

        console.log(subscription);

        // The subscription contains an invoice
        // If the invoice's payment succeeded then you're good,
        // otherwise, the payment intent must be confirmed

        // The subscription contains an invoice which has a payment intene object
        // If the invoice's payment succeeded then you're good and firestore document
        // should be updated to reflected those changes. It means payment is done.
        // However, there is a chance that 3D secure verification needs to happen here
        // so if that is the case then the status will be `requires_action` and to handle
        // that we call stripe.confirmPayment with the client_secret on the payment intent
        // and that will prompt the user to login with their bank to verify the payment
        // and it will complete the process to make the subscription

        const { latest_invoice } = subscription;

        if (latest_invoice.payment_intent) {
          const { client_secret, status } = latest_invoice.payment_intent;

          if (status === "requires_action") {
            const { error: confirmationError } =
              await stripe.confirmCardPayment(client_secret);
            if (confirmationError) {
              console.error(confirmationError);
              alert("unable to confirm card");
              return;
            }
          }

          // success
          alert("You are subscribed!");
          getSubscriptions();
        }

        setLoading(false);
        setPlan(null);
      } else {
        event.preventDefault();

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        // Create Payment Method
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        // Make payment
        const paymentIntent = (await createPaymentIntent(
          39900, // 399
          plan,
          paymentMethod.id,
          user.uid,
          user.email
        )) as Stripe.PaymentIntent;

        const { client_secret, status } = paymentIntent;
        if (status === "requires_action") {
          const { error: confirmationError } = await stripe.confirmCardPayment(
            client_secret
          );
          if (confirmationError) {
            console.error(confirmationError);
            alert("unable to confirm card");
            return;
          }
        }

        // success
        alert("You are subscribed!");

        setLoading(false);
        setPlan(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const planFormJsx = () => {
    if (displayForm)
      return (
        <form className="plan-form" ref={planFormRef} onSubmit={handleSubmit}>
          <div className="label">Selected plan is {plan}</div>
          <CardElement
            className="card-field"
            options={{
              style: {
                base: {
                  fontSize: "17px",
                  fontFamily: "Sofia Pro",
                },
              },
            }}
          />
          <button className="btn" type="submit" disabled={loading}>
            Subscribe & Pay
          </button>
        </form>
      );
  };

  useEffect(() => {
    if (displayForm) planFormRef.current.scrollIntoView({ behavior: "smooth" });
  }, [displayForm]);

  const handlePlanCardClick = (planId: string) => {
    setPlan(planId);
    setDisplayForm(true);
  };

  return (
    <main>
      <section className="payment-section">
        <HeadingWithIcon icon={<ShoppingCartSVG />} text="Plan" />
        <SizedBox height="1rem" />
        <Divider />
        <SizedBox height="1rem" />

        <div className="cards">
          <PlanCard
            key={1}
            planId="price_1JNDOAIW9OOyJTj3AUEx4cAc"
            heading="Monthly"
            description="You will be charged monthly. You can cancel your subscription anytime."
            price={5}
            planType="month"
            handleClick={handlePlanCardClick}
          />
          <PlanCard
            key={2}
            planId="price_1JNDOAIW9OOyJTj3NCxSXF31"
            heading="Annualy"
            description="You will be charged annualy. You can cancel your subscription anytime."
            price={49}
            planType="year"
            handleClick={handlePlanCardClick}
          />
          <PlanCard
            key={3}
            planId="price_1JNDOBIW9OOyJTj3k2RAA27Q"
            heading="Infinity"
            description="You will be charged once and after that you’ll get lifetime access."
            price={399}
            planType="one-time"
            handleClick={handlePlanCardClick}
          />
        </div>

        <SizedBox height="4rem" />
        {planFormJsx()}
      </section>
    </main>
  );
}

function PlanCard({
  planId,
  heading,
  price,
  planType,
  description,
  handleClick,
}) {
  return (
    <div className="plan-card">
      <div className="heading">{heading}</div>
      <div className="price-info">
        <span className="icon">₹</span> <span className="price">{price}</span>
        <span className="plan-type">/{planType}</span>
      </div>
      <SizedBox height="2rem" />
      <Divider />
      <SizedBox height="2rem" />
      <div className="description">{description}</div>

      <button onClick={() => handleClick(planId)}>Choose Plan</button>
    </div>
  );
}

function ShoppingCartSVG() {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8967 18.1534C12.041 13.4652 15.6639 9.84778 20.2501 8.81396L21.1818 8.60395C24.667 7.81833 28.2759 7.81833 31.7611 8.60395L32.6928 8.81396C37.279 9.84778 40.9019 13.4652 42.0462 18.1534C42.9308 21.7772 42.9308 25.57 42.0462 29.1938C40.9019 33.882 37.279 37.4994 32.6928 38.5332L31.7611 38.7432C28.2759 39.5288 24.667 39.5288 21.1818 38.7432L20.2501 38.5332C15.6639 37.4994 12.041 33.882 10.8967 29.1938C10.0121 25.57 10.0121 21.7772 10.8967 18.1534Z"
        fill="#FFE600"
      />
      <path
        d="M10.8967 29.1938L12.4146 28.8233L10.8967 29.1938ZM10.8967 18.1534L9.37872 17.7829L10.8967 18.1534ZM42.0462 18.1534L43.5642 17.7829L42.0462 18.1534ZM42.0462 29.1938L43.5642 29.5643L42.0462 29.1938ZM31.7611 38.7432L31.4175 37.219L31.4175 37.219L31.7611 38.7432ZM21.1818 38.7432L20.8382 40.2675L20.8382 40.2675L21.1818 38.7432ZM21.1818 8.60395L21.5254 10.1282L21.5254 10.1282L21.1818 8.60395ZM31.7611 8.60395L32.1047 7.07969L32.1047 7.07969L31.7611 8.60395ZM20.2501 38.5332L20.5937 37.0089L20.5937 37.0089L20.2501 38.5332ZM32.6928 38.5332L33.0364 40.0575L33.0364 40.0575L32.6928 38.5332ZM32.6928 8.81396L32.3492 10.3382L32.3492 10.3382L32.6928 8.81396ZM20.2501 8.81396L19.9065 7.28971L19.9065 7.28971L20.2501 8.81396ZM12.6537 11.6897L11.1167 11.971L11.1167 11.971L12.6537 11.6897ZM11.3967 13.5007C11.552 14.3496 12.3661 14.9118 13.2149 14.7564C14.0638 14.6011 14.626 13.787 14.4706 12.9381L11.3967 13.5007ZM7.56757 4.71182C6.71806 4.56016 5.90645 5.12588 5.75479 5.97539C5.60313 6.82491 6.16885 7.63652 7.01836 7.78818L7.56757 4.71182ZM19.1074 39.2357C19.2634 39.5711 19.3239 39.9486 19.2793 40.3221L22.3822 40.693C22.4955 39.7455 22.3433 38.7829 21.9409 37.9178L19.1074 39.2357ZM19.2793 40.3221C19.2347 40.6955 19.0875 41.0432 18.8609 41.325L21.2962 43.2833C21.894 42.5399 22.2689 41.6407 22.3822 40.693L19.2793 40.3221ZM18.8609 41.325C18.6346 41.6064 18.3398 41.8093 18.015 41.9165L18.9943 44.8841C19.9005 44.585 20.698 44.0272 21.2962 43.2833L18.8609 41.325ZM18.015 41.9165C17.6906 42.0235 17.3447 42.0325 17.0162 41.9429L16.194 44.9578C17.1151 45.209 18.0876 45.1833 18.9943 44.8841L18.015 41.9165ZM17.0162 41.9429C16.6873 41.8532 16.3839 41.6668 16.1449 41.3987L13.8126 43.4787C14.4479 44.191 15.2732 44.7067 16.194 44.9578L17.0162 41.9429ZM16.1449 41.3987C15.9054 41.1303 15.7415 40.7918 15.6784 40.4216L12.5979 40.9466C12.7582 41.8875 13.1777 42.7667 13.8126 43.4787L16.1449 41.3987ZM15.6784 40.4216C15.6153 40.0513 15.6569 39.6708 15.7964 39.3266L12.9002 38.1527C12.5418 39.0369 12.4375 40.0059 12.5979 40.9466L15.6784 40.4216ZM15.7964 39.3266C15.9357 38.9828 16.1651 38.694 16.4509 38.4899L14.635 35.9467C13.8586 36.5011 13.2588 37.2682 12.9002 38.1527L15.7964 39.3266ZM36.3096 38.7872C36.5773 39.022 36.7794 39.336 36.8852 39.6953L39.8828 38.8122C39.6123 37.8939 39.0895 37.0686 38.3701 36.4377L36.3096 38.7872ZM36.8852 39.6953C36.9911 40.0548 36.9946 40.4392 36.895 40.8009L39.9079 41.6305C40.1619 40.7077 40.1533 39.7302 39.8828 38.8122L36.8852 39.6953ZM36.895 40.8009C36.7955 41.1624 36.5989 41.4806 36.335 41.7207L38.4382 44.032C39.1459 43.388 39.6538 42.5534 39.9079 41.6305L36.895 40.8009ZM36.335 41.7207C36.0716 41.9604 35.7521 42.1128 35.4162 42.1661L35.9063 45.2524C36.8519 45.1023 37.7301 44.6764 38.4382 44.032L36.335 41.7207ZM35.4162 42.1661C35.0805 42.2194 34.7359 42.1728 34.4218 42.0292L33.1229 44.8715C33.9939 45.2695 34.9606 45.4026 35.9063 45.2524L35.4162 42.1661ZM34.4218 42.0292C34.1071 41.8854 33.8323 41.6484 33.635 41.3399L31.0023 43.0236C31.5181 43.8301 32.2524 44.4737 33.1229 44.8715L34.4218 42.0292ZM33.635 41.3399C33.4374 41.031 33.3277 40.6658 33.3235 40.288L30.1987 40.3231C30.2094 41.2803 30.4868 42.2175 31.0023 43.0236L33.635 41.3399ZM33.3235 40.288C33.3193 39.9102 33.4207 39.5422 33.6116 39.2282L30.9412 37.6051C30.4442 38.4227 30.1879 39.366 30.1987 40.3231L33.3235 40.288ZM20.5937 10.3382L21.5254 10.1282L20.8382 7.07969L19.9065 7.28971L20.5937 10.3382ZM31.4175 10.1282L32.3492 10.3382L33.0364 7.28971L32.1047 7.07969L31.4175 10.1282ZM32.3492 37.009L31.4175 37.219L32.1047 40.2675L33.0364 40.0575L32.3492 37.009ZM21.5254 37.219L20.5937 37.0089L19.9065 40.0575L20.8382 40.2675L21.5254 37.219ZM12.4146 28.8233C11.5895 25.4429 11.5895 21.9042 12.4146 18.5239L9.37872 17.7829C8.43476 21.6501 8.43476 25.6971 9.37872 29.5643L12.4146 28.8233ZM40.5283 18.5239C41.3534 21.9043 41.3534 25.4429 40.5283 28.8233L43.5642 29.5643C44.5081 25.6971 44.5081 21.6501 43.5642 17.7829L40.5283 18.5239ZM31.4175 37.219C28.1586 37.9536 24.7843 37.9536 21.5254 37.219L20.8382 40.2675C24.5496 41.1041 28.3933 41.1041 32.1047 40.2675L31.4175 37.219ZM21.5254 10.1282C24.7843 9.39358 28.1586 9.39358 31.4175 10.1282L32.1047 7.07969C28.3933 6.24309 24.5496 6.24308 20.8382 7.07969L21.5254 10.1282ZM20.5937 37.0089C16.6054 36.1099 13.423 32.9545 12.4146 28.8233L9.37872 29.5643C10.659 34.8094 14.7223 38.8888 19.9065 40.0575L20.5937 37.0089ZM33.0364 40.0575C38.2206 38.8888 42.2839 34.8094 43.5642 29.5643L40.5283 28.8233C39.5199 32.9545 36.3375 36.1099 32.3492 37.009L33.0364 40.0575ZM32.3492 10.3382C36.3375 11.2372 39.5199 14.3926 40.5283 18.5239L43.5642 17.7829C42.2839 12.5378 38.2206 8.45832 33.0364 7.28971L32.3492 10.3382ZM19.9065 7.28971C14.7223 8.45832 10.659 12.5378 9.37872 17.7829L12.4146 18.5239C13.423 14.3926 16.6054 11.2372 20.5937 10.3382L19.9065 7.28971ZM11.8055 32.2055H41.1374V29.0805H11.8055V32.2055ZM11.1167 11.971L11.3967 13.5007L14.4706 12.9381L14.1907 11.4084L11.1167 11.971ZM7.01836 7.78818C9.067 8.15391 10.7197 9.80149 11.1167 11.971L14.1907 11.4084C13.5676 8.00397 10.9468 5.31511 7.56757 4.71182L7.01836 7.78818Z"
        fill="black"
      />
      <path
        d="M29.168 14.5833L29.253 14.5955C32.8105 15.1037 35.418 17.742 35.418 20.8333"
        stroke="black"
        stroke-width="3.125"
        stroke-linecap="round"
      />
    </svg>
  );
}

export default Upgrade;

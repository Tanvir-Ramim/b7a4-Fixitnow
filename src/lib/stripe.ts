import Stripe from "stripe";
import config from "../config";

const stripe: Stripe = new Stripe(config.stripe_secret_key);

export { stripe };

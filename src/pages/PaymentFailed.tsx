import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message") || "Payment could not be processed";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Error Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              Payment Failed
            </h1>
            <p className="text-lg text-muted-foreground">
              We couldn't process your payment
            </p>
          </div>

          {/* Error Details */}
          <Card className="p-6 space-y-6 mb-6">
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-2">
                What happened?
              </h2>
              <p className="text-muted-foreground">
                {message}
              </p>
            </div>

            {orderId && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your order has been created but payment was not completed
                </p>
              </div>
            )}

            <div className="bg-accent rounded-lg p-4 space-y-2">
              <h3 className="font-display font-semibold text-foreground text-sm">
                Common reasons for payment failure:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Insufficient balance in your account</li>
                <li>• Payment gateway timeout</li>
                <li>• Incorrect payment details</li>
                <li>• Bank server issues</li>
                <li>• Transaction limit exceeded</li>
              </ul>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {orderId && (
                <Button
                  size="lg"
                  onClick={() => navigate(`/checkout?retry=${orderId}`)}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Retry Payment
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/cart")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <Card className="p-6 mt-8 bg-card border-2">
            <div className="text-center space-y-2">
              <h3 className="font-display font-semibold text-foreground">
                Need Help?
              </h3>
              <p className="text-sm text-muted-foreground">
                If you continue to face issues with payment, please contact our support team
              </p>
              <div className="pt-2">
                <Button variant="link" className="text-primary">
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PaymentFailed;

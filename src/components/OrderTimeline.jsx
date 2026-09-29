import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bell, CheckCheck, AlertCircle, XCircle } from 'lucide-react';

export const OrderTimeline = ({ status, prepTimeMinutes, estimatedReadyTime, readyAt, completedAt, cancelReason }) => {
  if (status === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900">
        <div className="flex items-center gap-3">
          <XCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
          <div>
            <h3 className="font-extrabold text-base">Order Cancelled</h3>
            <p className="text-xs text-rose-700 mt-1">Reason: {cancelReason || 'Canteen cancellation'}</p>
            <p className="text-xs text-rose-600 font-semibold mt-1">Refund has been initiated to your original payment source.</p>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      key: 'PAID',
      title: 'Payment Successful',
      description: 'Order placed & payment verified',
      icon: CheckCircle2
    },
    {
      key: 'ACCEPTED',
      title: 'Order Accepted',
      description: 'Canteen counter confirmed your order',
      icon: Clock
    },
    {
      key: 'PREPARING',
      title: 'Kitchen is Preparing',
      description: prepTimeMinutes ? `Estimated preparation: ~${prepTimeMinutes} mins` : 'Food is being freshly prepared',
      icon: ChefHat
    },
    {
      key: 'READY',
      title: 'Ready for Pickup!',
      description: 'Piping hot and ready at the canteen counter',
      icon: Bell
    },
    {
      key: 'COMPLETED',
      title: 'Picked Up & Completed',
      description: 'Order collected successfully',
      icon: CheckCheck
    }
  ];

  const statusOrder = ['PAID', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {steps.map((step, index) => {
        const isPassed = currentIndex > index;
        const isCurrent = currentIndex === index;
        const isFuture = currentIndex < index;
        const Icon = step.icon;

        let iconContainerClasses = 'bg-white text-slate-300 border-2 border-slate-200';
        let titleClasses = 'text-slate-400 font-medium';
        let descClasses = 'text-slate-400';

        if (isPassed) {
          iconContainerClasses = 'bg-emerald-500 text-white border-2 border-emerald-500 shadow-sm';
          titleClasses = 'text-slate-800 font-bold';
          descClasses = 'text-slate-500';
        } else if (isCurrent) {
          if (step.key === 'READY') {
            iconContainerClasses = 'bg-emerald-600 text-white border-2 border-emerald-400 ring-4 ring-emerald-100 shadow-md animate-bounce';
            titleClasses = 'text-emerald-700 font-extrabold text-base sm:text-lg';
            descClasses = 'text-emerald-600 font-semibold';
          } else {
            iconContainerClasses = 'bg-brand-500 text-white border-2 border-brand-500 ring-4 ring-brand-100 shadow-md';
            titleClasses = 'text-brand-600 font-extrabold text-base';
            descClasses = 'text-slate-700 font-medium';
          }
        }

        return (
          <div key={step.key} className="relative flex items-start gap-4">
            {/* Step Icon Badge */}
            <div
              className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${iconContainerClasses}`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </div>

            {/* Step Information */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className={`text-sm sm:text-base ${titleClasses}`}>{step.title}</h4>
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 animate-pulse">
                    In Progress
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 leading-relaxed ${descClasses}`}>{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};


import { TriangleAlert } from "lucide-react";

export default function ErrorAlert({ typeError = "Name is missing" }) {
  return (
    <div
      className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600 
                 animate-slide-up transition-all duration-500 ease-out 
                 absolute bottom-10 right-4 sm:bottom-10 sm:right-10 max-w-md w-[90%] sm:w-auto"
    >
      <p className="text-sm sm:text-base flex items-center">
        <TriangleAlert
          className="me-2 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        {typeError}
      </p>
    </div>
  );
}

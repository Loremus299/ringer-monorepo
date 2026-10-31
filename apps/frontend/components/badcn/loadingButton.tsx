import React, { ComponentProps } from "react";
import { Button } from "../ui/button";

type Props = ComponentProps<typeof Button> & { loading?: boolean };

export default function LoadingButton({
  children,
  loading,
  disabled,
  ...props
}: Props) {
  const childrenArr = React.Children.toArray(children);

  if (loading && React.isValidElement(childrenArr[0])) {
    const originalKey = childrenArr[0].key ?? "loader-icon";

    childrenArr[0] = (
      <p key={originalKey} className="animate-spin">
        ↻
      </p>
    );
  }

  return (
    <Button {...props} disabled={loading || disabled}>
      {childrenArr}
    </Button>
  );
}

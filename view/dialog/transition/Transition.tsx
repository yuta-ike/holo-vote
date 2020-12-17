import { Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import React, { forwardRef } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
})

export default Transition
import { UiActions} from "../Slice/UiSlice";

export const throwMainException = (error, dispatch) => {
  dispatch(UiActions.setIsError(error.replace("Error: ", "")));
};

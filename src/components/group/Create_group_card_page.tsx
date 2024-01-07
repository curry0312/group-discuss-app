import Create_group_card from "./Create_group_card";

const Create_group_card_page = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 bg-black bg-opacity-50 backdrop-blur z-[60]">
      <div className="fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 md:w-[50%] lg:w-[30%]">
        <Create_group_card />
      </div>
    </div>
  );
};

export default Create_group_card_page

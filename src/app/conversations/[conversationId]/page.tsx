import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessage";
import EmptyState from "@/app/components/EmptySate";
import Header from "./components/header";
import Body from "./components/body";
import Form from "./components/form";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} ></Header>
        <Body initialMessages={messages} />
        <Form></Form>
      </div>
    </div>
  );
};

export default ConversationId;
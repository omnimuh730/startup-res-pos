import {
  Alert,
  Banner,
  BottomSheet,
  Breadcrumbs,
  Button,
  CalendarGrid,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  ChatBubble,
  ChatContainer,
  ChatInput,
  Checkbox,
  CircularProgress,
  DatePicker,
  Drawer,
  EmptyState,
  FileUploader,
  Input,
  ListGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiSelect,
  Navbar,
  NumberInput,
  OrderSummary,
  Pagination,
  PasswordInput,
  PaymentMethod,
  Popover,
  ProgressBar,
  Radio,
  RadioGroup,
  Rating,
  SearchBar,
  Select,
  StepperCounter,
  TabList,
  TabPanel,
  Tabs,
  TabTrigger,
  Textarea,
  ToastProvider,
  Toggle,
  Tooltip
} from "../index";

export function WebSmokeComponents() {
  return (
    <ToastProvider>
      <Navbar title="Smoke" />
      <Breadcrumbs items={[{ label: "Home", value: "home" }]} />
      <Button>Button</Button>
      <Input label="Input" />
      <Textarea label="Textarea" />
      <PasswordInput label="Password" />
      <Checkbox label="Check" />
      <Radio label="Radio" />
      <RadioGroup><Radio label="Inside group" /></RadioGroup>
      <Toggle label="Toggle" />
      <Select options={[{ label: "A", value: "a" }]} />
      <MultiSelect options={[{ label: "A", value: "a" }]} />
      <NumberInput value={1} />
      <StepperCounter value={1} />
      <SearchBar />
      <FileUploader />
      <Card>
        <CardHeader><CardTitle>Card</CardTitle></CardHeader>
        <CardDescription>Description</CardDescription>
        <CardContent />
        <CardFooter />
      </Card>
      <ListGroup items={[{ id: "1", label: "One" }]} />
      <EmptyState />
      <Tabs>
        <TabList><TabTrigger value="a">A</TabTrigger></TabList>
        <TabPanel value="a">A panel</TabPanel>
      </Tabs>
      <Tooltip content="tip"><Button>Hover</Button></Tooltip>
      <Popover trigger={<Button>Open</Button>}>Popover</Popover>
      <Modal open>
        <ModalHeader />
        <ModalBody />
        <ModalFooter />
      </Modal>
      <Drawer open>Drawer</Drawer>
      <BottomSheet open>Bottom</BottomSheet>
      <Carousel><Button>Slide</Button></Carousel>
      <ProgressBar value={30} />
      <CircularProgress value={30} />
      <Rating value={3} />
      <Pagination page={1} totalPages={5} />
      <OrderSummary items={[{ id: "1", label: "Item", price: 12 }]} />
      <PaymentMethod cards={[{ id: "1", label: "Card" }]} />
      <ChatContainer><ChatBubble message={{ id: "1", text: "hello", from: "me" }} /></ChatContainer>
      <ChatInput />
      <CalendarGrid config={{ year: 2026, monthZeroBased: 0 }} />
      <DatePicker year={2026} monthZeroBased={0} />
      <Alert>Alert</Alert>
      <Banner>Banner</Banner>
    </ToastProvider>
  );
}

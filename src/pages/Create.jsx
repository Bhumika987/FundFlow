import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Web3Context } from "../contexts/Web3Context";
import { formatEther, parseEther } from "ethers";  // New way

export default function Create() {
  const { contract } = useContext(Web3Context);
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    days: "7"
  });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await contract.createCampaign(
        form.title,
        form.description,
        parseEther(form.goal),
        Number(form.days)
      );
      toast({
        title: "Campaign created!",
        status: "success"
      });
      setForm({ title: "", description: "", goal: "", days: "7" });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Heading mb={6}>Create Campaign</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Goal (ETH)</FormLabel>
          <Input
            type="number"
            value={form.goal}
            onChange={(e) => setForm({...form, goal: e.target.value})}
            min="0.01"
            step="0.01"
          />
        </FormControl>

        <FormControl mb={6}>
          <FormLabel>Duration (Days)</FormLabel>
          <Input
            type="number"
            value={form.days}
            onChange={(e) => setForm({...form, days: e.target.value})}
            min="1"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={submitting}
          isDisabled={!form.title || !form.goal}
        >
          Create Campaign
        </Button>
      </form>
    </Box>
  );
}
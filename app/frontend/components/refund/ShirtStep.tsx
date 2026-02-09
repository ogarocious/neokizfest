import React, { useState } from "react";
import {
  Stack,
  Text,
  Group,
  NumberInput,
  Switch,
  ActionIcon,
  Box,
  Button,
} from "@mantine/core";
import {
  IconShirt,
  IconArrowRight,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { colors, responsiveText, mobileInputStyles, gradients } from "../../styles/theme";
import { GlassCard, GradientButton } from "../shared";
import ShirtSizeSelect from "../shared/ShirtSizeSelect";
import RefundCalculator from "./RefundCalculator";
import type { ShirtOrder, RefundDecision } from "../../types/refund";

const SHIRT_PRICE = 45;

interface ShirtStepProps {
  decision: RefundDecision;
  amountPaid: number;
  refundAmount: number;
  onContinue: (wantsShirt: boolean, shirts: ShirtOrder[]) => void;
}

const ShirtStep: React.FC<ShirtStepProps> = ({
  decision,
  amountPaid,
  refundAmount,
  onContinue,
}) => {
  const [wantsShirt, setWantsShirt] = useState(false);
  const [shirts, setShirts] = useState<ShirtOrder[]>([{ size: "M", quantity: 1 }]);

  const addShirt = () => {
    setShirts([...shirts, { size: "M", quantity: 1 }]);
  };

  const removeShirt = (index: number) => {
    if (shirts.length > 1) {
      setShirts(shirts.filter((_, i) => i !== index));
    }
  };

  const updateShirt = (index: number, updates: Partial<ShirtOrder>) => {
    setShirts(
      shirts.map((shirt, i) => (i === index ? { ...shirt, ...updates } : shirt))
    );
  };

  const shirtTotal = shirts.reduce(
    (total, shirt) => total + shirt.quantity * SHIRT_PRICE,
    0
  );

  const finalRefund = Math.max(0, refundAmount - (wantsShirt ? shirtTotal : 0));

  const handleContinue = () => {
    onContinue(wantsShirt, wantsShirt ? shirts : []);
  };

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text
          fw={600}
          c={colors.textPrimary}
          style={{ fontSize: responsiveText.sectionTitle }}
        >
          Commemorative T-Shirt
        </Text>
        <Text c={colors.textMuted} style={{ fontSize: responsiveText.body }}>
          Would you like to purchase a commemorative Neo Kizomba Festival t-shirt?
          The cost will be deducted from your refund (if applicable).
        </Text>
      </Stack>

      {/* Shirt Option Toggle */}
      <GlassCard
        style={{
          border: `2px solid ${wantsShirt ? colors.primary : "rgba(255, 255, 255, 0.08)"}`,
          background: wantsShirt
            ? "linear-gradient(135deg, rgba(244, 93, 0, 0.12) 0%, rgba(162, 90, 60, 0.16) 100%)"
            : "rgba(255, 255, 255, 0.03)",
        }}
      >
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Group gap="md">
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                background: gradients.primaryButton,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconShirt size={32} color="white" />
            </Box>
            <Stack gap={4}>
              <Text fw={600} c={colors.textPrimary} style={{ fontSize: responsiveText.body }}>
                Neo Kizomba Festival T-Shirt
              </Text>
              <Text c={colors.textMuted} style={{ fontSize: responsiveText.small }}>
                Limited edition commemorative design
              </Text>
              <Text fw={700} c={colors.primary} style={{ fontSize: responsiveText.body }}>
                ${SHIRT_PRICE} each
              </Text>
            </Stack>
          </Group>

          <Switch
            checked={wantsShirt}
            onChange={(e) => setWantsShirt(e.currentTarget.checked)}
            size="lg"
            color="orange"
            label={wantsShirt ? "Yes" : "No"}
            labelPosition="left"
          />
        </Group>
      </GlassCard>

      {/* Shirt Selection */}
      {wantsShirt && (
        <Stack gap="md">
          {shirts.map((shirt, index) => (
            <GlassCard key={index} variant="subtle">
              <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
                <Group gap="md" style={{ flex: 1 }} wrap="wrap">
                  <Box style={{ flex: 1, minWidth: 120, maxWidth: 200 }}>
                    <ShirtSizeSelect
                      value={shirt.size}
                      onChange={(size) =>
                        size && updateShirt(index, { size })
                      }
                      variant="segmented"
                    />
                  </Box>
                  <NumberInput
                    label="Quantity"
                    value={shirt.quantity}
                    onChange={(val) =>
                      updateShirt(index, {
                        quantity: typeof val === "number" ? Math.max(1, val) : 1,
                      })
                    }
                    min={1}
                    max={10}
                    style={{ width: 100 }}
                    styles={mobileInputStyles}
                  />
                  <Text fw={600} c={colors.primary} style={{ minWidth: 60, fontSize: responsiveText.body }}>
                    ${(shirt.quantity * SHIRT_PRICE).toFixed(2)}
                  </Text>
                </Group>

                {shirts.length > 1 && (
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeShirt(index)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                )}
              </Group>
            </GlassCard>
          ))}

          <Button
            variant="light"
            color="gray"
            leftSection={<IconPlus size={18} />}
            onClick={addShirt}
            style={{ fontSize: responsiveText.small }}
          >
            Add Another Size
          </Button>
        </Stack>
      )}

      {/* Refund Calculation */}
      <RefundCalculator
        decision={decision}
        amountPaid={amountPaid}
        refundAmount={refundAmount}
        shirtTotal={wantsShirt ? shirtTotal : 0}
        finalRefund={finalRefund}
      />

      <GradientButton
        size="md"
        rightSection={<IconArrowRight size={18} />}
        onClick={handleContinue}
      >
        Continue
      </GradientButton>
    </Stack>
  );
};

export default ShirtStep;

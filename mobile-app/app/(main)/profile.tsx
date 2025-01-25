
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { useAuth } from "@/context/auth";
import { usePocketBase } from "@/context/pocketbase";
import { ExchangesResponse } from "@/pocketbase-types";
import { ReactElement, useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Profile(): ReactElement {

  const { pb } = usePocketBase();
  const { user } = useAuth();
  const [exchangeOptions, setExchangeOptions] = useState<ReactElement[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>();
  const [apiKey, setApiKey] = useState<string>();

  useEffect(() => {
    const resp = async () => {
      if (pb) {
        const respAll = await pb?.collection('exchanges').getFullList<ExchangesResponse>({ sort: 'name' });
        const exchOpt = respAll?.map(exchange => ({ value: exchange.id, label: exchange.name }));
        setExchangeOptions(optionsToView(exchOpt));
      }
    }

    resp();
  }, [pb]);

  function optionsToView(options: { value: string, label: string }[]): ReactElement[] {
    return options.map(opt => {
      return <SelectItem key={opt.value} label={opt.label} value={opt.value} />
    })

  }

  async function submit() {
    if (user) {
      const apiKeyRecord = await pb?.collection('user_exchange_api_keys').create({ api_key: apiKey, exchange: selectedOption })
      await pb?.collection('users').update(user?.id, { "api_keys+": apiKeyRecord?.id })
    }
  }


  return (
    <View className="p-4 flex flex-col gap-4">
      <Select onValueChange={(value) => setSelectedOption(value)}>
        <SelectTrigger variant="outline" size="md">
          <SelectInput placeholder="Select exchange" />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {exchangeOptions}
          </SelectContent>
        </SelectPortal>
      </Select>
      <Input variant="outline" size="md">
        <InputField placeholder="Enter Api Key" onChangeText={(value) => setApiKey(value)} />
      </Input>
      <Button size="md" variant="outline" action="primary" onPress={() => submit()}>
        <ButtonText>Save</ButtonText>
      </Button>

    </View>
  );
}

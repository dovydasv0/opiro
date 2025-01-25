
import { usePocketBase } from "@/context/pocketbase";
import { ExchangesResponse } from "@/pocketbase-types";
import { ReactElement, useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Profile(): ReactElement {

  const { pb } = usePocketBase();
  const [exchangeOptions, setExchangeOptions] = useState<ReactElement[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    const resp = async () => {
      if (pb) {
        const respAll = await pb?.collection('exchanges').getFullList<ExchangesResponse>({ sort: 'name' });
        const exchOpt = respAll?.map(exchange => ({ value: exchange.id, label: exchange.name }));
        setSelectedOption(exchOpt[0].value)
        setExchangeOptions(optionsToView(exchOpt));
      }
    }

    resp();
  }, [pb]);

  function optionsToView(options: { value: string, label: string }[]): ReactElement[] {
    return options.map(opt => {
      return (
        <View className={`px-2 py-1 rounded-xl`}
          style={{ backgroundColor: selectedOption == opt.value ? "black" : "white" }}
        >
          <Pressable onPress={() => setSelectedOption(opt.value)}>
            <Text>{opt.label}</Text>
          </Pressable>
        </View>
      )
    })

  }


  return (
    <View>
      <View className="flex flex-row gap-2 p-4">
        {exchangeOptions}
      </View>
      <Text>{selectedOption}</Text>
    </View>
  );
}

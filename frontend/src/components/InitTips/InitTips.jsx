import { useEffect, useState } from 'react';
import {
  Flex, HStack,
  Heading,
  Button, Icon,
  Spacer,
} from '@chakra-ui/react';
import { CircleCheck, CircleX, RotateCcw } from 'lucide-react';
import TipEntry from './TipEntry';
import TipEntrySkeleton from './TipEntrySkeleton';
import tips from './tips';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function InitTips({ barangayId, userId }) {
  const [doTips, setDoTips] = useState([]);
  const [dontTips, setDontTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRandomTips = () => {
    const doTipsList = tips.filter(t => t.type === "do");
    const dontTipsList = tips.filter(t => t.type === "dont");

    const selectedDo = [];
    const selectedDont = [];

    // Get 3 random DO tips
    for (let i = 0; i < 3 && doTipsList.length > 0; i++) {
      const randomIdx = Math.floor(Math.random() * doTipsList.length);
      selectedDo.push(doTipsList[randomIdx]);
      doTipsList.splice(randomIdx, 1);
    }

    // Get 3 random DON'T tips
    for (let i = 0; i < 3 && dontTipsList.length > 0; i++) {
      const randomIdx = Math.floor(Math.random() * dontTipsList.length);
      selectedDont.push(dontTipsList[randomIdx]);
      dontTipsList.splice(randomIdx, 1);
    }

    return { doTips: selectedDo, dontTips: selectedDont };
  };

  const fetchTips = async (force = false) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!barangayId) {
        throw new Error("Barangay ID not provided");
      }

      const url = new URL(`${API_BASE_URL}/suggestions/tips/${barangayId}`);
      if (userId) url.searchParams.append("user_id", userId);
      if (force) url.searchParams.append("force", "true");

      const res = await fetch(url.toString());

      if (!res.ok) throw new Error("Failed to fetch tips");

      const fetchedTips = await res.json();
      
      // Separate tips by is_do field
      const doTipsArray = fetchedTips.filter(tip => tip.is_do);
      const dontTipsArray = fetchedTips.filter(tip => !tip.is_do);

      setDoTips(doTipsArray);
      setDontTips(dontTipsArray);
    } catch (err) {
      console.error("Error fetching tips, using fallback:", err);
      setError(err.message);
      
      // Fallback to random tips from local tips.js
      const { doTips: fallbackDo, dontTips: fallbackDont } = getRandomTips();
      setDoTips(fallbackDo);
      setDontTips(fallbackDont);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [barangayId, userId]);

  return (
    <Flex direction="column" gap="20px" w="100%">
      <HStack>
        <Heading size={['sm', 'md']}>Init Tips</Heading>
        <Spacer />
        <Button
          size="xs"
          p="0"
          onClick={() => fetchTips(true)}
        >
          <Icon as={RotateCcw} boxSize={4} />
        </Button>
      </HStack>

      {error && (
        <Flex
          bg="red.100"
          p="5px 10px"
          borderRadius="5px"
          color="red.700"
          fontSize="xs"
        >
          Using local tips - {error}
        </Flex>
      )}
      
      <Flex direction="column" gap="10px">
        <Flex align="center" gap="5px" color="brand.300">
          <Icon as={CircleCheck} boxSize={5} />
          <Heading size={['xs', 'sm']}>GAWIN</Heading>  
        </Flex>
        <Flex direction="column">
          {isLoading ? (
            <>
              <TipEntrySkeleton />
              <TipEntrySkeleton />
              <TipEntrySkeleton />
            </>
          ) : (
            doTips.map((tip, idx) => (
              <TipEntry 
                key={idx} 
                guideData={{
                  heading: tip.main_text || tip.heading,
                  body: tip.sub_text || tip.body,
                  type: "do"
                }} 
              />
            ))
          )}
        </Flex>
      </Flex>
      
      <Flex direction="column" gap="10px">
        <Flex align="center" gap="5px" color="red.300">
          <Icon as={CircleX} boxSize={5} />
          <Heading size={['xs', 'sm']}>HUWAG GAWIN</Heading>
        </Flex>
        <Flex direction="column">
          {isLoading ? (
            <>
              <TipEntrySkeleton />
              <TipEntrySkeleton />
              <TipEntrySkeleton />
            </>
          ) : (
            dontTips.map((tip, idx) => (
              <TipEntry 
                key={idx} 
                guideData={{
                  heading: tip.main_text || tip.heading,
                  body: tip.sub_text || tip.body,
                  type: "dont"
                }} 
              />
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default InitTips;

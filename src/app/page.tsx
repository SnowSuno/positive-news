'use client';
import { useState } from 'react';
import { useMutation, QueryClient, useQueryClient } from '@tanstack/react-query';
import { fetchNews, urlSchema } from '@/actions/fetchNews';
import {
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Progress,
  Skeleton,
  SkeletonText,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { analyzeSentiment } from '@/actions/analyzeSentiment';

const sentimentValues = {
  positive: {
    label: '긍정',
    color: 'blue',
  },
  negative: {
    label: '부정',
    color: 'red',
  },
  neutral: {
    label: '중립',
    color: 'gray',
  },
} as const;

export default function Home() {
  const queryClient = useQueryClient();
  const [newsURL, setNewsURL] = useState('');
  const { error } = urlSchema.safeParse(newsURL);
  const errorMessage = newsURL.length > 0 ? error?.issues[0]?.message : undefined;

  const { mutateAsync: getNews, data: newsData, isPending: isFetchingNews } = useMutation({ mutationFn: fetchNews });
  const {
    mutateAsync: analyzeNewsSentiment,
    data: sentimentData,
    isPending: isAnalyzing,
    reset,
  } = useMutation({ mutationFn: analyzeSentiment });

  const onSubmit = async () => {
    reset();

    const news = await getNews(newsURL);
    await analyzeNewsSentiment(news.textContent);
  };

  return (
    <Container>
      <Spacer h={20} />
      <FormControl isInvalid={!!errorMessage}>
        <FormLabel>뉴스 URL 주소</FormLabel>
        <Input type="text" value={newsURL} onChange={e => setNewsURL(e.target.value)} />
        {!errorMessage ? (
          <FormHelperText>분석할 네이버 뉴스 URL을 입력해 주세요</FormHelperText>
        ) : (
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        )}
      </FormControl>
      <Spacer h={6} />
      <Button
        isDisabled={!!error}
        colorScheme="blue"
        isLoading={isFetchingNews || isAnalyzing}
        loadingText={isFetchingNews ? '뉴스 가져오는 중' : '분석하는 중'}
        onClick={onSubmit}
      >
        뉴스 가져오기
      </Button>

      <Spacer h={6} />

      {(sentimentData || isFetchingNews || isAnalyzing) && (
        <Card variant="outline" h={44}>
          <CardBody>
            <Text fontSize="sm" color="gray">
              감정 분석 결과
            </Text>
            <Spacer h={1} />
            <Heading size="md">
              {sentimentData ? (
                sentimentValues[sentimentData.document.sentiment].label
              ) : (
                <Skeleton mt={1} noOfLines={1} w={10} h={5} />
              )}
            </Heading>
            <Spacer h={4} />

            <VStack spacing={1} width="100%" align="stretch">
              {(['positive', 'negative', 'neutral'] as const).map(sentiment => (
                <Flex key={sentiment} align="center">
                  <Text w={12} fontSize="small">
                    {sentimentValues[sentiment].label}
                  </Text>

                  <Progress
                    flex={1}
                    value={sentimentData?.document.confidence[sentiment] ?? 0}
                    colorScheme={sentimentValues[sentiment].color}
                    size="sm"
                  />
                  <Text w={16} fontSize="small" textAlign="right">
                    {sentimentData?.document.confidence[sentiment].toFixed(2) ?? '-'}%
                  </Text>
                </Flex>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      <Spacer h={4} />

      {(isFetchingNews || newsData) && (
        <Card variant="filled">
          <CardBody>
            <Spacer h={3} />
            <Heading size="md">
              {isFetchingNews && <SkeletonText noOfLines={1} spacing="4" skeletonHeight="4" />}
              {newsData?.title}
            </Heading>

            <Spacer h={4} />

            {isFetchingNews && <SkeletonText noOfLines={10} spacing="4" skeletonHeight="2" />}
            {newsData && (
              <>
                <Text style={{ whiteSpace: 'pre-line' }}>
                  {/* <Highlight
                    query={
                      sentimentData?.sentences
                        .filter(sentence => sentence.sentiment === 'positive')
                        .map(sentence => sentence.content) ?? []
                    }
                    styles={{ bg: 'orange.100' }}
                  > */}
                  {`${newsData.content}${newsData.truncated ? '...' : ''}`}
                  {/* </Highlight> */}
                </Text>
                <Spacer h={6} />
                {newsData.truncated && (
                  <Text fontSize="small" color="gray">
                    1000자까지만 분석됩니다.
                  </Text>
                )}
              </>
            )}
          </CardBody>
        </Card>
      )}
      <Spacer h={20} />
    </Container>
  );
}

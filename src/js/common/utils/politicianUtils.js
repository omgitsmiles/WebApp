import PoliticianActions from '../actions/PoliticianActions';
import PoliticianStore from '../stores/PoliticianStore';
import VoterStore from '../../stores/VoterStore';
import initializejQuery from './initializejQuery';

export function getPoliticianValuesFromIdentifiers (politicianSEOFriendlyPath, politicianWeVoteId) {
  // console.log('getPoliticianValuesFromIdentifiers politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
  let finalElectionDateInPast = false;
  // let isSupportersCountMinimumExceeded = false;
  let politician = {};
  let politicianCandidateList = [];
  let politicianDescription = '';
  let politicianImageUrlLarge = '';
  let politicianImageUrlMedium = '';
  let politicianImageUrlTiny = '';
  let politicianName = '';
  let politicianSEOFriendlyPathFromObject = '';
  let politicianUrl = '';
  let politicianWeVoteIdFromObject = '';
  let twitterFollowersCount = 0;
  let twitterHandle = '';
  let twitterHandle2 = '';
  let voterIsPoliticianOwner = false;
  if (politicianSEOFriendlyPath) {
    politician = PoliticianStore.getPoliticianBySEOFriendlyPath(politicianSEOFriendlyPath);
  } else if (politicianWeVoteId) {
    politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    ({ seo_friendly_path: politicianSEOFriendlyPathFromObject } = politician);
  }
  if (politician.constructor === Object && politician.politician_we_vote_id) {
    ({
      final_election_date_in_past: finalElectionDateInPast,
      // is_supporters_count_minimum_exceeded: isSupportersCountMinimumExceeded,
      politician_description: politicianDescription,
      politician_name: politicianName,
      twitter_followers_count: twitterFollowersCount,
      politician_twitter_handle: twitterHandle,
      politician_twitter_handle2: twitterHandle2,
      politician_url: politicianUrl,
      politician_we_vote_id: politicianWeVoteIdFromObject,
      voter_is_politician_owner: voterIsPoliticianOwner,
      we_vote_hosted_profile_image_url_large: politicianImageUrlLarge,
      we_vote_hosted_profile_image_url_medium: politicianImageUrlMedium,
      we_vote_hosted_profile_image_url_tiny: politicianImageUrlTiny,
    } = politician);
    // TODO: politicianCandidateList = PoliticianStore.getPoliticianCandidateList(politicianWeVoteIdFromObject);
    politicianCandidateList = [];
  }
  return {
    finalElectionDateInPast,
    // isSupportersCountMinimumExceeded,
    politicianDescription,
    politicianImageUrlLarge,
    politicianImageUrlMedium,
    politicianImageUrlTiny,
    politicianSEOFriendlyPath: politicianSEOFriendlyPathFromObject,
    politicianName,
    politicianCandidateList,
    politicianUrl,
    politicianWeVoteId: politicianWeVoteIdFromObject,
    twitterFollowersCount,
    twitterHandle,
    twitterHandle2,
    voterIsPoliticianOwner,
  };
}

export function retrievePoliticianFromIdentifiers (politicianSEOFriendlyPath, politicianWeVoteId) {
  // console.log('retrievePoliticianFromIdentifiersIfNeeded politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
  if (politicianSEOFriendlyPath) {
    initializejQuery(() => {
      PoliticianActions.politicianRetrieveBySEOFriendlyPath(politicianSEOFriendlyPath);
    });
    return true;
  } else if (politicianWeVoteId) {
    initializejQuery(() => {
      PoliticianActions.politicianRetrieve(politicianWeVoteId);
    });
    return true;
  } else {
    return false;
  }
}

export function retrievePoliticianFromIdentifiersIfNeeded (politicianSEOFriendlyPath, politicianWeVoteId) {
  // console.log('retrievePoliticianFromIdentifiersIfNeeded politicianSEOFriendlyPath: ', politicianSEOFriendlyPath, ', politicianWeVoteId: ', politicianWeVoteId);
  let politician = {};
  let mustRetrieveCampaign = false;
  const voter = VoterStore.getVoter();
  if (!('we_vote_id' in voter) || voter.we_vote_id.length < 0) {
    // Calling politicianRetrieve before we have a voter, is useless
    return false;
  }

  // console.log('retrievePoliticianFromIdentifiersIfNeeded voter:', voter);
  if (politicianSEOFriendlyPath) {
    politician = PoliticianStore.getPoliticianBySEOFriendlyPath(politicianSEOFriendlyPath);
    // console.log('retrievePoliticianFromIdentifiersIfNeeded politician:', politician);
    if (politician.constructor === Object) {
      if (!politician.politician_we_vote_id) {
        mustRetrieveCampaign = true;
      }
    } else {
      mustRetrieveCampaign = true;
    }
    // console.log('retrievePoliticianFromIdentifiersIfNeeded mustRetrieveCampaign:', mustRetrieveCampaign, ', politicianSEOFriendlyPath:', politicianSEOFriendlyPath);
    if (mustRetrieveCampaign) {
      initializejQuery(() => {
        PoliticianActions.politicianRetrieveBySEOFriendlyPath(politicianSEOFriendlyPath);
      });
    }
  } else if (politicianWeVoteId) {
    politician = PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId);
    if (politician.constructor === Object) {
      if (!politician.politician_we_vote_id) {
        mustRetrieveCampaign = true;
      }
    } else {
      mustRetrieveCampaign = true;
    }
    // console.log('retrievePoliticianFromIdentifiersIfNeeded mustRetrieveCampaign:', mustRetrieveCampaign, ', politicianWeVoteId:', politicianWeVoteId);
    if (mustRetrieveCampaign) {
      initializejQuery(() => {
        PoliticianActions.politicianRetrieve(politicianWeVoteId);
      });
    }
  }
  return true;
}

export function retrievePoliticianFromIdentifiersIfNotAlreadyRetrieved (politicianSEOFriendlyPath, politicianWeVoteId) {
  if (
    (politicianSEOFriendlyPath && PoliticianStore.getPoliticianBySEOFriendlyPath() !== {}) &&
    (politicianWeVoteId && PoliticianStore.getPoliticianByWeVoteId(politicianWeVoteId) !== {})
  ) {
    return false;
  }
  return retrievePoliticianFromIdentifiersIfNeeded(politicianSEOFriendlyPath, politicianWeVoteId);
}


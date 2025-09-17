import { StyleSheet } from 'react-native';

export const parkingHistorySectionStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  arrow: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  loadingText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingVertical: 20,
    lineHeight: 20,
  },
  sessionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  duration: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  location: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 4,
  },
  activeSession: {
    fontSize: 12,
    color: '#30D158',
    fontWeight: '600',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
});